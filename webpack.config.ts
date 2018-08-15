import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
// import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
// import ExtractTextPlugin from 'extract-text-webpack-plugin'

const config: webpack.Configuration = {
  entry: {
    app:
      process.env.NODE_ENV === 'production'
        ? './client/app/app.tsx'
        : ['webpack-hot-middleware/client?reload=true', './client/app/app.tsx']
    // app: './client/app/app.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
    chunkFilename: '[id].chunk.js'
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  mode: process.env.NODE_ENV ? 'production' : 'development',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      app: 'client/app'
    }
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        // provide array of loaders
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              cacheDirectory: true,
              plugins:
                process.env.NODE_ENV === 'production'
                  ? ['inline-react-svg']
                  : ['react-hot-loader/babel', 'inline-react-svg']
              // plugins: ['inline-react-svg']
            }
          },
          'awesome-typescript-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(sa|c)ss$/,
        use: [
          ExtractCssChunks.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'react-svg-loader'
          }
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // process.env.NODE_ENV !== 'production' &&
    //   new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: './client/public/index.html',
      inject: 'body'
    }),

    new ExtractCssChunks({
      filename: 'css/style.css'
    }),

    // 1. import dotenv
    // 2. dotenv.config() immediately after
    // 3. this line adds environment variables to the bundle
    new webpack.EnvironmentPlugin(['NODE_ENV'])

    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify(env)
    //   }
    // })
  ]

  // devServer: {
  //   hot: true,
  //   contentBase: './client/public',
  //   historyApiFallback: true,
  //   stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
  // }
}

export default config
