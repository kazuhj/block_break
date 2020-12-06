
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

// パドルを操作
// 最初は制御ボタンは押されていないためどちらにおいてもデフォルトの値はfalse
let rightPressed = false;
let leftPressed = false;

// スコアを数える
let score=0;
// ライフを与える
let lives = 3;

// ブロックの変数
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

// ブロックのための２次元配列を操作する入れ子のループを使った数行のコードを書き上げる
let bricks = [];

for(let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for(let r = 0; r < brickRowCount; r++) {
    // status:衝突フラグ
    bricks[c][r] = {x: 0, y: 0, status: 1};
  }
}

// 衝突検出関数
function collisionDetection() {
  for(var c = 0; c < brickColumnCount; c++) {
    for(var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];

      if(b.status == 1) {
        if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
    
          if(score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score:" + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives:" + lives, canvas.width - 65, 20);
}


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

// ブロックを定義
function drawBricks() {
  for(var c = 0; c < brickColumnCount; c++) {
    for(var r = 0; r < brickRowCount; r++) {

      if(bricks[c][r].status == 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }

}


function draw() {
  // Canvasの内容を消去するメソッド、clearRect()がある
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawBall();
  drawBricks();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // 上の壁を作る
  // もしボールの位置のyのが０未満だったら、またキャンバス高さを超えた場合、符号反転させた値を設定することでy軸方向の動きの向きを変える
  // 壁と円の中心の衝突地点を計算してしまっているのでballRadiusで調整
  // ゲームオーバー機能で条件分岐を編集
  if(y + dy < ballRadius) {
    dy = -dy;
  } else if(y + dy > canvas.height - ballRadius) {

    // ボールの位置がパドル内だったら
    if(x > paddleX && x < paddleX + paddleWidth) {
      if(y = y - paddleHeight) {
        dy = -dy;
      }
    }
    else {
      // ゲームオーバーになった時ライフを減らす
      lives--;

      if(!lives) {
        alert("GAME OVER");
        document.location.reload();
      }
      else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        // dx = 5;
        // dy = -5;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // x軸
  if(x + dx > canvas.width - ballRadius | x + dx < ballRadius) {
    dx = -dx;
  }

  // 右矢印が押された場合
  // &&の後：どちらのキーを長く押し続けたらパドルがCanvasの線から消えてしまうのを防ぐ
  if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if(leftPressed && paddleX > 0) {
    paddleX -=7;
  }


  // xとyに毎フレーム描画した後に小さな値を加え、ボールが動いているように見せる
  // しかし毎回描画しているので軌跡が残る
  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

// パドルを操作
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// パドルをマウスで操作
document.addEventListener("mousemove", mouseMoveHandler, false);


function keyDownHandler(e) {
  // 大抵のブラウザでは左右の矢印キーにそれぞれArrowLeftとArrowRightが対応。
  // ただし、IE/Edgeに対応する為に、LeftとRightも確認する必要あり
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

// -------------------

function keyUpHandler(e) {
  // 大抵のブラウザでは左右の矢印キーにそれぞれArrowLeftとArrowRightが対応。
  // ただし、IE/Edgeに対応する為に、LeftとRightも確認する必要あり
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

// ビューポートの水平方向のマウス位置(e.clientX)から
// キャンバスの左端とビューポートの左端の距離(canvas.offsetleft)を引いて
// relativeXの値をだす
// これはキャンバスの左端とマウスカーソルの距離と同じになる
function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }

}

// // ゲームオーバー機能実装のため変数化
// let interval = setInterval(draw, 10)

// 固定の１０ミリ秒のフレームレートではなくブラウザに制御を託す。
// ブラウザはフレームレートを適切に同期し図形を必要な時だけ描画する
// 古いsetInterval()メソッドよりも効率的で滑らかなアニメーションループになる
draw();


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