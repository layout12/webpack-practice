# 📖 목차
1. [Webpack 개요](#webpack-개요)  
2. [Webpack 프로젝트 시작](#webpack-프로젝트-시작)
   - [패키지 설치 및 초기설정](#패키지-설치-및-초기설정)
   - [Webpack 설정](#webpack-설정)
   - [HTML 자동 주입](#html-자동-주입)
   - [정적 파일 연결](#정적-파일-연결)
   - [CSS 파일 연결](#css-파일-연결)
   - [SCSS 적용](#scss-적용)
   - [Autoprefixer(PostCSS) 적용](#autoprefixerpostcss-적용)
   - [Babel](#babel)  

3. [Netlify에 프로젝트 배포하기](#netlify에-프로젝트-배포하기)
4. [NPX로 Degit 사용](#npx로-degit-사용)
# Webpack 개요

## 개념
- 브라우저에서 사용할 수 있도록 JavaScript 파일을 하나로 합쳐주는 `모듈 번들러`
- `모듈 번들러` : 웹 애플리케이션을 구성하는 자원(HTML,CSS,JS,Image 등)이 각각의 모듈이고 이것들을 조합해서 하나의 결과물(번들)을 만드는 도구

## 사용목적
1. 웹 애플리케이션의 빠른 로딩 속도와 높은 성능
2. 자바스크립트 모듈화로 인한 이슈 해결
3. 웹 개발 작업 자동화 도구

🔎 자세한 내용 참고 : <a href="https://ingg.dev/webpack/" target="_blank"> [JS] Webpack을 쓰는 이유 바로가기</a>

## 핵심 구성요소
### Entry
- 웹 자원을 변환하기 위해 필요한 최초 진입점
- 이 진입점으로부터 의존적인 모듈을 전부 찾아내고 이 관계로 생기는 구조를 디펜던시 그래프(<a href="https://webpack.kr/concepts/dependency-graph/" target="_blank">Dependency Graph</a>) 라고 함

### Loader
- 기본적으로 Webpack은 JavaScript 및 JSON 파일만 해석 가능
- JavaScript파일이 아닌 다른 웹 자원들을 변환해서 JavaScript에서 직접 로딩할 수 있도록 도와주는 기능

### Plugins
- 번들링된 결과물에 다양한 내장 플러그인을 통해 후처리 작업 가능

### Output
- Entry를 시작으로 의존되어 있는 모든 모듈을 하나로 묶고 조합하여 결과물의 이름과 위치를 정의

# 모듈 시스템
- 모듈로 분리된 JavaScript 파일들을 불러오는 방식을 정의한 API
- CommonJS, ESM, AMD 등이 있음

## CommonJS
Node.js 환경에서 기본 모듈 시스템

### 가져오기/내보내기
- 내보내기 : 자신의 데이터를 외부로 보내려면 `module.exports` 변수에 내보내고자 하는 데이터들을 담은 객체를 지정
- 가져오기 : 내보내기가 지정된 객체를 `require()`함수로 전달받아 그 데이터를 사용할 수 있음

✅예시) main.js에서 refer.js에 작성한 결과값을 콘솔에 출력시키기

refer.js
```js
const i = 15

module.exports = i  //내보낼 데이터
```

main.js
```js
const refer = require('./refer.js')  //가져올 모듈의 이름 또는 경로

console.log(i)    
```

# Webpack 프로젝트 시작
> - Node.js환경에서 작업
> - VSCode에 'webpack-practice' 폴더를 만들어 프로젝트 생성
> - 패키지 설치와 서버 온오프는 VSCode 터미널에 명령어로 실행

## 패키지 설치 및 초기설정

**1. npm 패키지 초기화**
```sh
$ npm init -y
```
`package.json` 파일 생성됨


프로젝트 구조
```
webpack-practice
└───package.json
```

**2. 개발용 패키지 설치**
```sh
$ npm i -D webpack webpack-cli webpack-dev-server@next
```
💡`@next`를 붙이는 이유 : webpack-cli 메이저 버전과 webpack-dev-server의 next 릴리즈 버전을 사용해야 버전이 일치

패키지명 | 설명 
--|--
`webpack` | 여러개 파일을 하나의 파일로 합쳐주는 모듈 번들러
`webpack-cli` |  webpack을 더 쉽게 사용할 수 있도록 다양한 명령을 제공
`webpack-dev-server` | 라이브 리로드 기능을 제공해서 매 코드 변경마다 빌드된 결과물을 확인할 수 있는 개발용 서버를 제공

**3. npm scripts 추가**  
서버실행과 빌드를 위해 package.json파일에 scripts 영역에 아래와 같이 추가

```js
{
  // ...
  "scripts": {
      "dev" : "webpack-dev-server --mode development",
      "build" : "webpack --mode production"
  },
  // ...
 }
```

## Webpack 설정
- 웹팩 version 4부터 별도의 config 파일 없이 번들링 가능  
  ⇒ 기본적으로 entry point를 `src/index.js`로 인식, 제품화를 위해 번들된 결과를 `dist/main.js`로 내보냄
- 사용자의 필요에 따라 config 파일을 변경하기 위해 옵션을 작성할 수 있음 
- (<a href="https://createapp.dev/" target="_blank">createapp.dev</a>는 사용자 정의 webpack 설정을 생성하기 위한 온라인 도구

**1. html 파일 생성**
- 프로젝트 폴더 내에 index.html 생성하고 간단하게 내용 입력하고 reset.css cdn 링크 연결
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css">  <!-- 추가-->
  <title>Document</title>
</head>
<body>
  <h1>Hello Webpack!!</h1> <!-- 추가-->
</body>
</html>
```

**2. 진입할 js파일 생성**  
- 프로젝트에서 webpack에서 웹 자원을 변환하기 위해 최초 진입점이 될 폴더와 js파일을 `./js/main.js` 경로대로 생성

**3. webpack.config.js 생성**  
- 다양한 설정을 생성하기 위해 설정 파일 생성
- 현재 Node.js 환경이므로 CommonJS 방식으로 입력

`webpack.config.js`
```js
// Node.js 모듈 path 가져오기
const path = require('path')

// CommonJS 방식의 모듈 내보내기
module.exports = {
  // 진입점 파일 설정(js파일만 가능)
  entry : './js/main.js',

  // 내보낼 파일 출력 설정(절대경로로 명시해야 함)
  output : {   

    //웹팩으로 빌드한 파일 이름(생략가능)
    filename: 'main.js',

    //내보내질 경로(생략가능)
    path :  path.resolve(__dirname, 'dist')

    //지정한 결과물이 내보내지는 디렉토리안에 사용하지 않는 파일을 알아서 정리
    clean : true
  }
}
```
- `require('path')` : 번들링되어 내보내진 path 모듈을 가져옴
- `path`는  Node.js에서 기본적으로 제공하는 전역모듈로 파일과 폴더의 경로 작업을 위한 기능을 제공
   - path.resolve(__dirname, 'dist')는 명시하지 않아도 자동 설정됨
     - `__dirname` : Node.js에서 현재 프로젝트 폴더를 지칭하는 전역변수
     - `dist` : 빌드될 때 생기는 폴더명으로 번들된 결과물이 담긴 폴더명(번들명은 바꾸어도 됨)
- `filename`: 번들된 결과의 파일이름으로 설정하지 않아도 자동 설정됨

**3. 터미널에서 build 실행 명령어 입력**
```sh
$ npm run build
```
**4. build 실행 결과**  
> entry point인 `./js/main.js`에 내용을 읽어 `__dirname` 현재 프로젝트 루트에서 `./dist/main.js`형태로 출력

[프로젝트 구조]
```
webpack-practice
├───dist                //번들화
│   └───main.js         //번들화
├───js                  //추가함
│   └───main.js         //추가함
├───node_modules
├───index.html          //추가함
├───package-lock.json
├───package.json
└───webpack.config.js
```

## HTML 자동 주입
빌드 시 html 모듈을 자동 주입하는 방법

**1. 개발의존성 플러그인 설치**  
`html-webpack-plugin` : html파일에 javascript 번들을 자동으로 묶어주는 플러그인
```sh
$ npm i -D html-webpack-plugin
```

**2. webpack.config.js에 설정 추가**
```js
// ...

//가져오기
const HtmlPlugin : require('html-webpack-plugin')

module.exports = {

  entry: './js/main.js',
  output: {
    // ...
  },
  //추가되는 부분
  plugins: [ 
    new HtmlPlugin({             // HtmlPlugin 인스턴스 생성
      template : './index.html'  // index.html을 기본 템플릿으로 반영할 수 있도록 설정
    })
  ]
}
```

**3. 터미널에서 개발 서버 실행**
```sh
$ npm run dev
```
html이 제대로 번들이 되었는지 위와 같이 서버 실행 후 `http://ip주소:포트번호` 주소가 출력됨.  
만일 안나온다면 webpack.config.js 파일에 아래와 같이 옵션 추가
```js
// ...

module.exports = {
  // ...
  plugins: [ 
   // ...
  ],
  devServer : {
    host : 'localhost'  //devServer 실행시 사용될 호스트 지정
  }
}
```

**4. 개발 서버 실행 결과** 
 ```sh
$ npm run dev
```
⇒ html에 h1태그에 작성했던 'Hello Webpack!!'이 브라우저에 출력되고 콘솔에도 Hello Webpack! 이라고 출력됨

**5. 프로젝트 build 후 결과**  
```sh
//개발 서버 종료(Ctrl + C) 후 빌드
$ npm run build
```
⇒ dist 폴더에 index.html 모듈이 난독화되어 추가됨  
⇒ dist/index.html에 main.js가 &lt;script&gt; 태그에 연결되어 삽입되었음 확인
```html
<!-- ./dist/index.html에 추가된 ./dist/main.js -->
<script defer="defer" src="main.js"></script>
```

[프로젝트 구조]
```
webpack-practice
├───dist
│   ├───index.html     //번들화
│   └───main.js
├───js
│   └───main.js
├───node_modules
├───index.html         
├───package-lock.json
├───package.json
└───webpack.config.js
```

## 정적 파일 연결
png파일과 favicon.ico 파일과 같은 정적 파일들을 빌드시 자동으로 번들링 해주는 방법

**1. 정적 파일 생성**  
루트에 `static` 폴더를 만들어 favicon.ico 파일을 넣고 `staic/images` 폴더를 만들어 그 안에 이미지 파일인 logo.png을 삽입

**2. html에 정적파일 연결**  
index.html에 img태그 추가
```html
<body>
  <!-- //... -->
  <img src="./images/logo.png" alt="logo" />
</body>
```

**3. 개발의존성 플러그인 설치**  
`copy-webpack-plugin` : 빌드할 때 정적 파일을 dist폴더로 복사하여 자동 삽입하게 해주는 패키지 
```sh
$ npm i -D copy-webpack-plugin
```
**4. webpack.config.js에 설정 추가**

```js

//가져오기
// ...
const CopyPlugin : require('copy-webpack-plugin')

module.exports = {

  entry: './js/main.js',
  output: {
    // ...
  },
  
  plugins: [ 
    // ...
    }),
    //추가되는 부분
    new CopyPlugin({
      patterns: [
        { from: 'static' }
      ]
    })

  ]
  // ...
}
```
- `new CopyPlugin` : CopyPlugin 인스턴스 생성
- `plugins.patterns.from` : 명시된 이름의 폴더로부터 파일을 복사하는 경로
- `from: 'static'` : 'static'이라는 폴더안에 내용들이 복사되어 dist 폴더 내로 삽입됨

**5. 개발서버 실행 후 결과**
```shell
$ npm run dev
```
⇒ 브라우저에 logo.png파일이 출력

**6. 프로젝트 build 후 결과**  
```sh
//개발 서버 종료(Ctrl + C) 후 빌드
$ npm run build
```
⇒ dist 폴더에 favicon.ico파일과 images 폴더가 복사되어 삽입됨  
⇒ dist/index.html에 img태그와 경로가 잘 명시되어 있음
```html
<!-- ./dist/index.html에 삽입된 img태그-->
<body>
  <!-- 중략... -->
  <img src="./images/logo.png" alt="logo"/>
</body>
```

[프로젝트 구조]
```
webpack-practice
├───dist
│   ├───images        //번들화
│   │   └───logo.png  //번들화
│   ├───favicon.ico   //번들화  
│   ├───index.html     
│   └───main.js
├───js
│   └───main.js
├───node_modules
├───static            //추가함
│   ├───images        //추가함
│   │   └───logo.png  //추가함
│   └───favicon.ico   //추가함
├───index.html
├───package-lock.json
├───package.json
└───webpack.config.js
```

## CSS 파일 연결
빌드 시 CSS 모듈을 자동 주입하는 방법

**1. CSS 파일 생성**  
static폴더에 css 폴더 생성 후 그 안에 `main.css` 파일 생성 후 간단한 스타일 입력

```css
body {
  background-color: orange;
}
```

**2.1. html &lt;head&gt;사이 링크방식으로 CSS파일 연결**  

```html
<head>
  <!-- //reset.css 바로 아래 추가 -->
  <link rel="stylesheet" href="./css/main.css">  
</head>
```

**2.2. 개발 서버 실행 후 결과 확인**
```sh
$ npm run dev
```
- static 폴더에 css 파일을 불러와서 브라우저에 입력한 스타일이 제대로 출력

**3.1. webpack loader로 CSS파일 연결**
1. staic폴더에 있던 css폴더를 루트 경로로 빼기
2. html &lt;head&gt;사이 링크연결도 삭제
2. main.js에 상단에 css를 import하는 내용 입력
```js
import '../css/main.css'
```
==> 빌드 시 진입점인 main.js를 가장 먼저 읽어들이는데 이때 js 파일에 import된 css 파일을 먼저 읽어서 index.html과 섞어서 dist 폴더로 내보내주는 구조가 됨.      
그러나, webpack은 css파일을 읽을 수 없고, dist폴더로 내어주는 역할만 하므로 외부 패키지를 설치해야 함

**3.2. 개발 의존성 패키지 설치**
- `css-loader` :  css 파일들을 읽어서 js에서 사용가능한 String으로 반환
- `style-loader` : `css-loader`가 반환해준 값을 실제로 dom에 &lt;style&gt; 태그로 넣어줌  
💡 `loader`란? 파일을 해석하고 변환하는 과정에 관여하여 모듈을 처리 
```sh
$ npm i -D css-loader style-loader
```
**3.3. webpack.config.js에 설정 추가**

```js

//가져오기
// ...

module.exports = {

  entry: './js/main.js',
  output: {
    // ...
  },
  
  plugins: [ 
    // ... 
  ],
 //추가되는 부분
  module: {
    rules: [ //모듈이 생성 될 때 요청과 일치하는 규칙 의 배열
      {
        //loader를 적용시킬 파일들을 정규식으로 명시  
        test: /\.css$/,  //.css로 끝나는 모든 파일      
        use: [   // 해당 파일에 적용할 로더를 오른쪽에서 왼쪽방향으로 읽어들임
          'style-loader',   
          'css-loader'
        ]
      }
    ]
  },

  // ...
}
```
**3.4. 개발서버실행 후 브라우저 확인**
- css 내용 바꾸고 다시 개발서버 실행해서 잘 적용되는지 확인
- 개발자도구에서 \<head\>영역안에 스타일이 \<style\> 태그안에 생성되어 있음 확인
```css
body {
  background-color: greenyellow;
}
```
```sh
$ npm run dev
```
[프로젝트 구조]
```
webpack-practice
├───css               //추가함
│   ├───main.css      //추가함
├───dist
│   ├───images        
│   │   └───logo.png  
│   ├───favicon.ico    
│   ├───index.html     
│   └───main.js       //번들화
├───js
│   └───main.js       //수정함
├───node_modules
├───static            
│   ├───images        
│   │   └───logo.png  
│   └───favicon.ico   
├───index.html
├───package-lock.json
├───package.json
└───webpack.config.js
```

## SCSS 적용
CSS의 전처리기인 SCSS로 변환해서 적용하는 방법

**1. css를 모두 scss로 변경**
- css/main.css -> scss/main.scss
- js/main.js의 import 경로도 scss로 수정
```js
$ import '../scss/main.scss'
```

**2. 개발 의존성 패키지 설치**
- `sass-loader` :  Sass/SCSS 파일을 로드하고 CSS로 컴파일 함
- `sass` : 읽은 scss 파일의 문법을 해석하는 모듈

```sh
$ npm i -D sass-loader sass
``` 

**3. webpack.config.js에 설정 수정 및 추가**
```js

//가져오기
// ...

module.exports = {

  entry: './js/main.js',
  output: {
    // ...
  },
  
  plugins: [ 
    // ... 
  ],

  module: {
    rules: [ 
      {
        //수정되는 부분 
        test: /\.s?css$/,  //css 또는 scss (? 앞 단어가 존재하거나 없는 파일 확장자로 끝나는 파일 모두 매칭)      
        use: [   // 해당 파일에 적용할 로더를 오른쪽에서 왼쪽방향으로 읽어들임
          'style-loader',   
          'css-loader',
           //추가되는 부분
          'sass-loader'
        ]
      }
    ]
  },

  // ...
}
```

**4.main.scss파일 내용 수정**
```scss
$color--black: #000;
$color--white: #fff;

body {
  background-color: $color--black;
  h1 {
    color: $color--white;
    font-size: 40px;
  }
}
```
**5. 개발서버실행 후 브라우저 확인**
- 개발서버 실행해서 스타일이 잘 적용되는지 확인
- 개발자도구에서 \<head\>영역안에 스타일이 \<style\> 태그안에 css 변환되어 있음 확인

```sh
$ npm run dev
```
[프로젝트 구조]
```
webpack-practice
├───dist
│   ├───images        
│   │   └───logo.png  
│   ├───favicon.ico    
│   ├───index.html     
│   └───main.js       //번들화
├───js
│   └───main.js       //수정함
├───node_modules
├───scss               //css -> scss로 변경
│   ├───main.scss      //main.css -> main.scss로 변경
├───static            
│   ├───images        
│   │   └───logo.png  
│   └───favicon.ico   
├───index.html
├───package-lock.json
├───package.json
└───webpack.config.js
```

## Autoprefixer(PostCSS) 적용
마크업 할 때 일부 브라우저에서 적용되지 않는 css 속성의 앞에 -mz-, -webkit- 등의 접두사(벤더 프리픽스)를 자동으로 붙여주는 방법

**1. scss에 적용할 태그속성 추가**
```scss
//... 

h1 {
    //... 

    //추가되는 부분
    display: flex;
  }
```
**2. 개발 의존성 패키지 설치**
- `postcss` :  CSS후처리기로 javascript를 이용해서 css를 변환
- `autoprefixer` : 브라우저 제조사(vender) 접두사(-webkit-, -moz- 등)를 필요한 경우 자동으로 추가해주는 플러그인 
- `postcss-loader` : 웹팩에서 `postcss`를 사용할 수 있게 해줌

```sh
$ npm i -D postcss autoprifixer postcss-loader
``` 

**3. webpack.config.js에 추가**
```js

//가져오기
// ...

module.exports = {

  entry: './js/main.js',
  output: {
    // ...
  },
  
  plugins: [ 
    // ... 
  ],

  module: {
    rules: [ 
      {       
        // ...  
        use: [   
          'style-loader',   
          'css-loader',
           //추가되는 부분
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },

  // ...
}
```
- module.rules에 있는 use에 나열된 로더들을 읽어들이는 위치 중요(작성맨 아래에서 위 순으로 적용)
- [순서정리]
  1. `sass-loader`로 sass파일을 먼저 로드해서 내용을 해석
  2. 해석된 내용 중에 공급업체 접두사를 붙이기 위해 `postcss-loader`실행
  3. `postcss`에 의해 변환한 css를 `css-loader`로 읽어들임
  4. `style-loader`로 html에 \<style\> 태그로 삽입

**4. package.json에 옵션 추가**  
`browserslist` : 지원되는 브라우저에 대한 옵션을 설정할 수 있게 하는 기능

`package.json`
```json
//...
 "devDependencies": {
    //...
  },

  //추가되는 부분
  "browserslist" : [
    "> 1%",               //전 세계 점유율 1% 이상의 브라우저 중에
    "last 2 versions"     //최신버전 2개를 선택
  ]
```
**5. 구성파일 생성**  
루트 경로에 `.postcssrc.js`(또는`postcss.config.js`) 파일 을 새로 생성하여 아래와 같이 옵션을 작성

```js
module.exports = {
  plugins : [
    require('autoprefixer')  //postcss의 플러그인으로 사용할 패키지를 가지고 와서 내보내기
  ]
}
```

**6. 개발서버실행 후 브라우저 확인**

```sh
$ npm run dev
```

- 개발자도구(F12)에서 \<h1\>태그를 확인하면 css 영역에 공급업체 접두가가 붙어서 출력됨을 확인  

[개발자도구에서 확인]
```css
body h1 {
    color: #fff;
    font-size: 40px;
    display: -webkit-box;   /* -webkit-*/
    display: -ms-flexbox;   /* -ms- */ 
    display: flex;
}
```
- 개발자도구(F12)에서 html 영역 \<head\>\<style\> 태그 안에도 스타일 적용되어있음 확인
```html
<style>
  body {
    background-color: #000;
  }
  body h1 {
    color: #fff;
    font-size: 40px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}
</style>
```
[프로젝트 구조]
```
webpack-practice
├───dist
│   ├───images        
│   │   └───logo.png  
│   ├───favicon.ico    
│   ├───index.html     
│   └───main.js       //번들화
├───js
│   └───main.js       
├───node_modules
├───scss               
│   ├───main.scss      
├───static            
│   ├───images        
│   │   └───logo.png  
│   └───favicon.ico  
├───.postcssrc.js    //추가함 
├───index.html
├───package-lock.json
├───package.json
└───webpack.config.js
```

## Babel
ES6 이전의 문법을 사용하는 브라우저에서 사용할 수 있도록 최신의 ES 문법을 이전 문법으로 변환하는 자바스크립트 트랜스 컴파일러

**1. 개발 의존성 패키지 설치**
- `@babel/core` : 변환 규칙을 적용하여 코드 변환을 하는 기본적인 기능을 제공하는 모듈 라이브러리
- `@babel/preset-env` : 바벨 플러그인을 모아놓은 패키지로 타깃 환경에 필요한 구문 변환(syntax transform), 브라우저 폴리필(browser polyfill)을 제공
   * `브라우저 폴리필(Polyfill)` : 브라우저가 지원하지 않는 자바스크립트 코드를 지원 가능하도록 변환한 코드
- `@babel/plugin-transform-runtime` : 코드 사이즈를 줄이기 위해 이미 사용한 helper code를 재사용 할 수 있는 플러그인
- `babel-loader`

```sh
# babel 컴파일러 패키지 설치
npm i -D @babel/core @babel/preset-env @babel/plugin-transform-runtime

# babel webpack loader 설치
npm i -D babel-loader
```

**2. 적용 브라우저 설정**
package.json에 브라우저 범위에 대한 옵션을 추가한다.  
(이미 앞서 Autoprefixer(PostCSS) 할 때 추가했음)

`package.json`
```json
//...
 "devDependencies": {
    //...
  },

  //추가되는 부분
  "browserslist" : [
    "> 1%",               //전 세계 점유율 1% 이상의 브라우저 중에
    "last 2 versions"     //최신버전 2개를 선택
  ]
```

**3. 구성파일 생성**  
루트 경로에 `.babelrc.js`(또는`babel.config.js`) 파일 을 새로 생성하여 아래와 같이 옵션을 작성

```js
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    ['@babel/plugin-transform-runtime']
  ]
}
```
**3. webpack.config.js에 추가**
```js

//가져오기
// ...

module.exports = {

  entry: './js/main.js',
  output: {
    // ...
  },
  
  plugins: [ 
    // ... 
  ],

  module: {
    rules: [ 
      {       
        test : /.\s?css$/,  
        use: [   
        // ...
        ]
      },
      // 추가되는 부분
      {
        // .js로 끝나는 모듈을 해석해서 use에 설정한 로더들로 분석해서 사용하겠다는 모듈 규칙
        test : /\.js$/,   
        use : [ 
          'babel-loader'  
        ]
      }
    ]
  },

  // ...
}
```
**4. 빌드하기**
```sh
$ npm run build
```

[프로젝트 구조]
```
webpack-practice
├───dist
│   ├───images        
│   │   └───logo.png  
│   ├───favicon.ico    
│   ├───index.html     
│   └───main.js       //번들화
├───js
│   └───main.js       
├───node_modules
├───scss               
│   ├───main.scss      
├───static            
│   ├───images        
│   │   └───logo.png  
│   └───favicon.ico  
├───.babelrc.js     //추가함 
├───.postcssrc.js  
├───index.html
├───package-lock.json
├───package.json
└───webpack.config.js
```

# Netlify에 프로젝트 배포하기

## Netlify란?
- 서버 없이 프론트엔드 스택으로만 구성된 정적 애플리케이션을 배포하는 용도
- 깃허브에 원격 저장소에 있는 내용을 가지고 가서 사이트를 자동으로 만들어 줌

## Netlify 사전준비
- 회원가입을 하고 Github 계정 연결되어야 함
- 배포할 어플리케이션으로 빌드할 github 저장소(repository) 준비(현재 이 프로젝트를 기준으로 배포할 것임)

## Netlify에 저장소 연결방법
1. 본인 계정 페이지에서 `Sites → Add new Site → Import an existing project` 선택
2. 연결할 공급자로 'Github' 선택해서 연결 후 연결할 저장소 선택
3. 빌드 도구를 사용한 설정이 화면에 나온것과 맞는지 확인 후 `Deploy site`버튼 클릭
4. 배포된 주소가 생성되고 주소 클릭해서 이동하면 프로젝트가 출력됨

# NPX로 Degit 사용
- `NPX` :  npm 패키지를 설치하지 않고 사용할 수 있게 해주는 도구  
   ⇒ Node.js 환경에서 사용하는 것으로 NPM이 설치되면 자동 설치가 되어있는 모듈
- `Degit` : 원격저장소 github에 있는 특정 저장소를 현재 로컬 경로에 다운로드

### 터미널에서 사용하기

**1. 빈 VSCode 터미널에서 경로이동**
- 프로젝트가 생성되지 않은 새 화면의 VSCode 터미널 열기
- window 탐색기에서 프로젝트를 생성할 경로를 복사
- VSCode에서 `poweshell`모드에서 복사한 경로로 이동하기 위한 명령어 입력

```sh
C:\> cd D:\workspace       //cd [프로젝트를 생성할 경로]
D:\workspace>
```
**2. 원격저장소 새 이름으로 가져오기**
아래와 같이 입력하면 `webpack-practice`의 내용을 `new-folder`명에 복사되어 이 명령어를 입력한 경로에 생성됨
```sh
// npx degit [github_id/github_복사할 저장소명] [로컬에 저장할 폴더명]
npx degit layout12/webpack-practice new-folder

Need to install the following packages:
  degit@2.8.4
Ok to proceed? (y) y   //y 입력
> cloned layout12/webpack-practice#HEAD to new-folder
```
**3. 새 프로젝트 폴더 확인**
- 터미널에서 `dir`해서 새로 폴더가 생성되었는지 확인 후 해당 폴더로 이동
```sh
D:\workspace> cd new-folder      
```
- 해당 폴더 경로에서 VSCode를 열기 위해 아래와 같이 명령어 입력
```sh
D:\workspace\new-folder> code . -r
```
**4. 새 프로젝트 내용 확인**
- VSCode가 열리고 복사된 원래 저장소의 내용이 새로운 폴더에 잘 들어갔는지 확인
- 새로운 프로젝트로 다시 시작함으로써 새롭게 버전관리가 가능  
  ⇒ clone 방식의 저장소 복제는 버전관리까지 포함해서 복제됨

# webpack 설정관련 참고
- <a href="https://webpack.kr/concepts/" target="_blank">Webpack document </a>

