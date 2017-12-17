var globalScope = {}; // Whatever is one higher than module when interpreted 
var secondMostGlobalScope = {}; // module

// module.exports 
secondMostGlobalScope.attribute = {
    methodOne: function () {
        // Lol, this is exactly what you're not supposed to do, i.e. edit the core
        methodOneCustomDate
        Date.prototype.customMethod = function() {
            this.MM = this.getMonth()+1; 
            return `Kitten mittens and this.getMonth()+1: ${this.MM}`;
        }

        const methodOneProperty = {
            'a': new Date().customMethod()
        };
        console.log(`methodOneProperty.a: ${methodOneProperty.a}`); 
    },
    
    methodTwo: function () {
        const methodTwoProperty = {
            'b': new Date().customMethod()
        };

        console.log(`methodTwoProperty.b: ${methodTwoProperty.b}`);
    }
    

}

var m = secondMostGlobalScope.attribute.methodOne(); // Output: methodOneProperty.a: Kitten mittens and this.getMonth()+1: 12
var n = secondMostGlobalScope.attribute.methodTwo(); // Output: methodTwoProperty.b: Kitten mittens and this.getMonth()+1: 12 


// Welp, I'm glad I verified that I was affecting the 