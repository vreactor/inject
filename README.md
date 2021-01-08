Inject
=

Simple dependency injection for JavaScript.

`Inject` handles nested dependencies, avoids infinite recursion, takes multiple patterns for object creation, and uses annotations for dependencies that are
minification-friendly. You may either set an array on the object to indicate the list of dependencies to inject into the constructor or specify the dependencies
when you add the object to the container.

Create an instance of the container (you may have as many containers as you like, but they are not aware of each other): 

    const $inject = new Inject();

`Inject` can handle multiple patterns for object creation: 

**Factory**

    function serviceA(dependencyB) {
        return {
          id: dependencyB.getId()
        };
    }

**Constructor Function** 

    function ServiceA(dependencyB) {
        this.id = dependencyB.getId();
    }

**Self-Invoking Function** 

    const ServiceA = (function() {
        function ServiceA(dependencyB) {
            this.id = dependencyB.getId();
        }
        return ServiceA;
    })();

**Function Annotation:**

    ServiceA.$deps = ["dependencyB"]; 
    $inject.register({token: "serviceA", value: ServiceA});

**Registration-time Annotation** 

    $inject.register({token: "serviceA", value: ServiceA, deps: ["dependencyB"]});
    
**Retrieving instances** 
    
    const serviceA = $inject.get("serviceA");
    const dependencyB = $inject.get("dependencyB");

The registration function can take an array or an object.

See the tests to learn more. 

