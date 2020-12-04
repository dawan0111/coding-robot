module.exports = (config, env) => {
  config.module.rules.push(
    {
      test: /\.mp3$/,
      options: {
        name: '[path][name].[ext]',
      },
      loader: 'file-loader'
  }
  )
  return config
}