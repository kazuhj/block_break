
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

// ーーーーーーーーーーーーーーーーーー

// ボールを動かす
// Canvasの映像を毎フレーム定期的に更新し続ける為には何度も実行されるような関数を定義する必要がある
// setIntervalといったJSのタイミング関数を用いれば同じ関数を何度も実行できる
// 無限に続くsetInterval性質のためdraw()は10ミリ秒おきにずっと、自分が止めるまで呼ばれ続ける

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

let ballRadius = 10;

// パドルを定義
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x,y,ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// パドルを定義
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX,canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}


function draw() {
  // Canvasの内容を消去するメソッド、clearRect()がある
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawBall()
  drawPaddle()

    // 上の壁を作る
    // もしボールの位置のyのが０未満だったら、またキャンバス高さを超えた場合、符号反転させた値を設定することでy軸方向の動きの向きを変える
    // 壁と円の中心の衝突地点を計算してしまっているのでballRadiusで調整
    if(y + dy > canvas.height - ballRadius | y + dy < ballRadius) {
      dy = -dy;
    }
    // x軸
    if(x + dx > canvas.width - ballRadius | x + dx < ballRadius) {
      dx = -dx;
    }


  // xとyに毎フレーム描画した後に小さな値を加え、ボールが動いているように見せる
  // しかし毎回描画しているので軌跡が残る
  x += dx;
  y += dy;



}

setInterval(draw, 10)


// --------------------------------

// 図形の定義

ctx.beginPath();
ctx.rect(20,40,50,50);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(240,160,20, 0, Math.PI * 2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.rect(160,10,100,40);
ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
ctx.stroke();
ctx.closePath();

