module.exports = (api) => {
  api.cache(false)

  const presets = [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      },
    }],
    '@babel/preset-react',
  ]

  return {
    presets,
  }
}
