let count = 5;

function addCount(x){
    return x+1;
}

console.log('before add count', count);

count = addCount(count);

console.log('after add count', count);