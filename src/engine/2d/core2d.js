const canvas2d = document.getElementById('view2d');
const ctx = canvas2d.getContext('2d');

function drawCircle(x, y, r){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

