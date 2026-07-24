function onCollide2d(obj1, obj2) {
    let distance = Math.sqrt((obj1.x - obj1.y)**2 + (obj2.x - obj2.y)**2);
    if (distance < 5) return true;
}