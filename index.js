const cheerio = require('cheerio')

var generateSelectors = (options) => {
  var selectors = []
  var defaultOptions = {
    ids: true,
    classNames: true,
    tagNames: generateSelectors.ignoreDefaultTagNames,
    styles: false
  }
  var matchesSelectorType = (option, value) => {
    if (typeof option === 'boolean') {
      return option
    } else if (!value) {
      return false
    } else if (typeof option === 'function') {
      return option(value)
    } else if (option instanceof RegExp) {
      return value.match(option) !== null
    } else {
      return false
    }
  }
  var opts = Object.assign(defaultOptions, options)
  if (typeof opts.markup !== 'string') {
    throw new Error('Markup is required')
  }

  var addElementSelector = (index, el) => {
    var selector = getSelectorForElement(cheerio(el))
    if (shouldAddSelector(selector)) {
      selectors.push(selector)
    }
  }

  var shouldAddSelector = (selector) => {
    return ((selector !== '') && (selectors.indexOf(selector) === -1) && !existsInStyles(selector))
  }

  var existsInStyles = (selector) => {
    if (!opts.styles) {
      return false
    }
    return opts.styles.indexOf('\n' + selector + '{') !== -1
  }

  var getSelectorForElement = (el) => {
    var resultString = ''
    var id = el.attr('id')
    var tagName = el.prop('tagName').toLowerCase()
    var classNames = el.attr('class')
      ? el.attr('class').split(' ').filter(convertClassName)
      : []
    if (matchesSelectorType(opts.tagNames, tagName)) {
      resultString += tagName
    }
    if (matchesSelectorType(opts.ids, id)) {
      if (typeof id !== 'undefined') resultString += '#' + id
    }
    resultString += classNames.map(createClassNameSelector).join('')
    return resultString
  }

  var createClassNameSelector = (className) => {
    return '.' + className
  }

  var convertClassName = (className) => {
    return matchesSelectorType(opts.classNames, className)
  }

  var convertSelectorToCode = selector => {
    return selector + '{\n  \n}\n'
  }

  var getExistingStyles = () => {
    if (opts.styles) {
      return opts.styles + '\n\n'
    } else {
      return ''
    }
  }

  var $ = cheerio.load(opts.markup)
  $('*').each(addElementSelector)
  var generatedSelectors = selectors.map(convertSelectorToCode).join('\n\n')

  return getExistingStyles() + generatedSelectors
}

generateSelectors.defaultIgnoredTagNames = [ 'html', 'head', 'body', 'style', 'link', 'script', 'meta', 'title', 'div', 'span', 'defs' ]

generateSelectors.ignoreDefaultTagNames = tagName => {
  return generateSelectors.defaultIgnoredTagNames.indexOf(tagName) === -1
}

module.exports = generateSelectors
