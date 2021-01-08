export const ERROR = {
	RECURSION: 'Recursive failure: Circular reference for dependency',
	REGISTRATION: 'Already registered.',
	ARRAY: 'Must pass array.',
	FUNCTION: 'Must pass function to invoke.',
	STRING: 'Must pass string',
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

        throw new Error(`[${name}] ${ERROR.SERVICE}`);
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

	registerProvider({token, value, deps = []}) {
		if (token && typeof token !== 'string') {
            throw new Error(`token: ${ERROR.STRING}`);
		}

		if (!token) {
            token = value.name;
		}

		if (typeof value !== 'function') {
            throw new Error(`[${token}] value: ${ERROR.FUNCTION}`);
		}

        if (!Array.isArray(deps)) {
            throw new Error(`[${token}] deps: ${ERROR.ARRAY}`);
		}

        if (this.container[token]) {
            throw new Error(`${token}] ${ERROR.REGISTRATION}`);
        }

        this.container[token] = () => {
            const Template = function() {};
            const _deps = !deps.length ? (value.$deps || []) : deps;
            let result = {};

            Template.prototype = value.prototype;

            const instance = new Template();
            const injected = this.invoke(value, _deps, instance, token);

            result = injected || instance;
            this.container[token] = () => result;

            return result;
        };
    }

    register(provider) {
		Array.isArray(provider) ? provider.forEach(provide => this.registerProvider(provide)) : this.registerProvider(provider);
    }
}
