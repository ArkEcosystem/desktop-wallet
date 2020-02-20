export default ({
  logo = 'https://ark.io/storage/66/square.svg',
  color = '#1a1b1f',
  brand = 'Brand',
  productName = 'Product Name',
  text = 'Loading...',
  version = 'Version "2.8.0'
}) => `
<!DOCTYPE html>
<meta charset="utf-8">
<html>
<head>
  <style>
    body,
    html {
      overflow: hidden;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
      font-size: 16px;
    }

    #box {
      position: absolute;
      overflow: hidden;
      width: 100%;
      height: 100%;
      margin: auto;
      user-select: none;
    }

    #logo {
      position: absolute;
      top: 25px;
      left: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 16px;
    }

    #logo img {
      width: 30px;
    }

    #logo #brand-name {
      margin-left: 5px;
      font-size: 1rem;
      font-weight: 200;
      color: white;
      letter-spacing: 0;
    }

    #box #product-name {
      position: absolute;
      top: 50%;
      left: 50%;
      display: inline-block;
      width: 100%;
      font-size: 2.188rem;
      color: white;
      transform: translateX(-50%) translateY(-120%);
      text-align: center;
    }

    #box .text {
      font-weight: 400;
      color: white;
    }

    #box h4 {
      font-size: 0.75rem;
      font-weight: 400;
      opacity: 50%;
    }

    #starting-txt {
      position: absolute;
      bottom: 13px;
      left: 25px;
    }

    #version {
      position: absolute;
      right: 25px;
      bottom: 13px;
    }

    .dot {
      position: absolute;
      top: 50%;
      left: -20%;
      width: 4px;
      height: 4px;
      margin: auto;
      border-radius: 5px;
      background: white;
      transform: translateY(40px);
    }

    #dot1 {
      animation: dotslide 2.8s infinite cubic-bezier(0.2, 0.8, 0.8, 0.2);
    }

    #dot2 {
      animation: dotslide 2.8s 0.2s infinite cubic-bezier(0.2, 0.8, 0.8, 0.2);
    }

    #dot3 {
      animation: dotslide 2.8s 0.4s infinite cubic-bezier(0.2, 0.8, 0.8, 0.2);
    }

    #dot4 {
      animation: dotslide 2.8s 0.6s infinite cubic-bezier(0.2, 0.8, 0.8, 0.2);
    }

    #dot5 {
      animation: dotslide 2.8s 0.8s infinite cubic-bezier(0.2, 0.8, 0.8, 0.2);
    }

    @keyframes dotslide {
      0% {
        left: -20%;
      }

      100% {
        left: 120%;
      }
    }
  </style>
</head>
<body style="background-color: ${color}">
  <div id="box" style="background-color: ${color}">
    <span id="logo">
      <img src="${logo}" />
      <h6 id="brand-name">${brand}</h6>
    </span>
    <h1 class="text" id="product-name">${productName}</h1>
    <div class="dot" id="dot1"></div>
    <div class="dot" id="dot2"></div>
    <div class="dot" id="dot3"></div>
    <div class="dot" id="dot4"></div>
    <div class="dot" id="dot5"></div>
    <h4 class="text" id="starting-txt">${text}</h4>
    <h4 class="text" id="version">${version}</h4>
  </div>
</body>
</html>
`
