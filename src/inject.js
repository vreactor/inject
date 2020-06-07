export const ERROR = {
	RECURSION: 'Recursive failure: Circular reference for dependency',
	REGISTRATION: 'Already registered.',
	ARRAY: 'Must pass array.',
	FUNCTION: 'Must pass function to invoke.',
	SERVICE: 'Service does not exist.'
};

export class Inject {
    constructor() {
        this.container = {};
        this.stack = {};
		this.container['$Inject'] = () => this;
    }

    get(name) {
        const wrapper = this.container[name];

        if (wrapper) {
            return wrapper();
        }

        throw new Error(ERROR.SERVICE);
    }

    invoke(fn, deps, instance, name) {
        const args = [];

        if (this.stack[name]) {
            throw new Error(`${ERROR.RECURSION} ${name}: ${JSON.stringify(Object.keys(this.stack))}`);
        }

        this.stack[name] = instance;

        deps.forEach(dependency => args.push(this.get(dependency)));

        delete this.stack[name];

        return fn.apply(instance, args);
    }

    register(name, annotatedArray) {
        if (!Array.isArray(annotatedArray)) {
            throw new Error(ERROR.ARRAY);
        }

        if (this.container[name]) {
            throw new Error(ERROR.REGISTRATION);
        }

        if (typeof annotatedArray[annotatedArray.length - 1] !== 'function') {
            throw new Error(ERROR.FUNCTION);
        }

        this.container[name] = () => {
            let result = {};
            const Template = function() {};
            const fn = annotatedArray[annotatedArray.length - 1];
            const deps = annotatedArray.length === 1 ? (annotatedArray[0].$deps || []) : annotatedArray.slice(0, annotatedArray.length - 1);

            Template.prototype = fn.prototype;

            const instance = new Template();
            const injected = this.invoke(fn, deps, instance, name);

            result = injected || instance;
            this.container[name] = () => result;

            return result;
        };
    }
}
