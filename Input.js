class Inputs{
    constructor(currentStates,namesKeycode){
        this.currentStates = currentStates;
        this.namesKeycode = namesKeycode;
    }
    static empty(){
        return new Inputs(new Map(), new Map());
    }
    static attachInput(inputs,name,keyCode){
        var newInputs = R.clone(inputs)
        newInputs.namesKeycode.set(name,keyCode);
        newInputs.currentStates.set(keyCode,false);
        return newInputs;
    }
    static update(inputs,keyCode,value){
        var newInputs = R.clone(inputs)
        newInputs.currentStates.set(keyCode,value);
        return newInputs;
    }
    static attachInputs(inputs){
        var newInputs = R.clone(inputs)
        newInputs = Inputs.attachInput(newInputs,"UP",'w');
        newInputs = Inputs.attachInput(newInputs,"DOWN",'s');
        newInputs = Inputs.attachInput(newInputs,"LEFT",'a');
        newInputs = Inputs.attachInput(newInputs,"RIGHT",'d');
        return newInputs;
    }
    static getInputs(inputs){
        const nameKeys = Array.from(inputs.namesKeycode.keys());
        const namesValue = R.map(n => {
            return {name:n,value:inputs.currentStates.get(inputs.namesKeycode.get(n))}
        },nameKeys);
        const output = R.map((nv) => {return nv.name},
                        R.filter((nv) => {return nv.value},
                            namesValue));
        return output;
    }
}
