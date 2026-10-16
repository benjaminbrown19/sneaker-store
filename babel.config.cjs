module.exports = (api) => {
  const esTest = api.env('test')
  return {
    presets: [
      ['@babel/preset-env', { targets: { chrome: '100' } }],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    plugins: esTest
      ? [['istanbul', { exclude: ['src/tests/**', '**/*.spec.jsx', '**/*.spec.js'] }]]
      : [],
  }
}
