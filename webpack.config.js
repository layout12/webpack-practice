const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry : './js/main.js',

  //현재 프로젝트폴더/dist 경로에 main.js 이름으로 ./js/main.js 파일에 연결된 모든 내용들을 합쳐서 output
  output : {
    // path: path.resolve(__dirname, 'dist'),
    // filename: 'main.js',
    clean : true
  },

  // 번들링 후 결과물의 처리 방식 등 다양한 플러그인들을 설정
  plugins: [
    new HtmlPlugin({
      template : './index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'static' }
      ]
    })
  ],
  
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },

  devServer : {
    host : 'localhost'
  }
}