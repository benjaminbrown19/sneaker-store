import jasmineDom from '@testing-library/jasmine-dom'

const matchers = jasmineDom.default ?? jasmineDom

beforeAll(() => {
  jasmine.addMatchers(matchers)
})

beforeEach(() => {
  localStorage.clear()
})

const contexto = import.meta.webpackContext('.', {
  recursive: true,
  regExp: /\.spec\.jsx?$/,
})
contexto.keys().forEach(contexto)
