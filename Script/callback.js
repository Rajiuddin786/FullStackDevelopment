const name1 ={
    fname:"Rajiuddin",
    lname:"Sk",
}
const name2 = {
    fname:"Tajuddin",
    lname:"Sk",
}

const printName = function(district,state,cname) {
    console.log(this.fname+" "+this.lname+" is from "+district+","+state+" using callback function "+cname)
}

printName.call(name1,"Hooghly","West Bengal","call function")
printName.call(name2,"Hooghly","West Bengal",'call function')

printName.apply(name1,["Howrah","West Bengal","apply function"])
printName.apply(name2,["Howrah","West Bengal","apply function"])

const printMyName = printName.bind(name1,"Hooghly","West Bengal","bind function")

printMyName()