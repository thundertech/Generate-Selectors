/* global describe, it */
const chai = require('chai')
const assert = chai.assert
const generateSelectors = require('../index.js')
const fs = require('fs')
const testMarkup = fs.readFileSync('./test/test-markup.html', 'utf8')

describe.only('generateSelectors', function () {
  describe('options parameter', function () {
    it('includes all classNames only', function () {
      assert.include(
        generateSelectors(
          {
            ids: false,
            tagNames: false,
            classNames: true,
            styles: false,
            markup: testMarkup
          }
        ),
        fs.readFileSync('./test/classes-only.css', 'utf8')
      )
    })

    it('includes all ids only', function () {
      assert.include(
        generateSelectors(
          {
            classNames: false,
            tagNames: false,
            ids: true,
            styles: false,
            markup: testMarkup
          }
        ), fs.readFileSync('./test/ids-only.css', 'utf8')
      )
    })

    it('excludes uncommonly-styled tag names via a predicate function but includes all ids and class names (defaults)', function () {
      assert.include(
        generateSelectors(
          {
            classNames: true,
            ids: true,
            tagNames: generateSelectors.ignoreDefaultTagNames,
            styles: false,
            markup: testMarkup
          }
        ), fs.readFileSync('./test/defaults.css', 'utf8')
      )
    })

    it('includes all ids and class names, as well as a subset of tag names via a regular expression', function () {
      assert.include(
        generateSelectors(
          {
            classNames: true,
            ids: true,
            tagNames: /^(div|span|p|ul)$/,
            styles: false,
            markup: testMarkup
          }
        ), fs.readFileSync('./test/tags-regex.css', 'utf8')
      )
    })

    it('includes all tag names only', function () {
      assert.include(
        generateSelectors(
          {
            ids: false,
            classNames: false,
            tagNames: true,
            styles: false,
            markup: testMarkup
          }
        ), fs.readFileSync('./test/tags-only.css', 'utf8')
      )
    })

    it('includes all ids and all tag names but no class names', function () {
      assert.include(
        generateSelectors(
          {
            ids: true,
            classNames: false,
            tagNames: true,
            styles: false,
            markup: testMarkup
          }
        ), fs.readFileSync('./test/ids-and-tags-only.css', 'utf8')
      )
    })

    it('includes all ids and all class names but no tag names', function () {
      assert.include(
        generateSelectors(
          {
            ids: true,
            classNames: true,
            tagNames: false,
            styles: false,
            markup: testMarkup
          }
        ), fs.readFileSync('./test/ids-and-classes-only.css', 'utf8')
      )
    })

    it('includes only class names based on a regular expression', function () {
      assert.include(
        generateSelectors(
          {
            ids: false,
            classNames: /^utility-/,
            tagNames: false,
            styles: false,
            markup: testMarkup
          }
        ), fs.readFileSync('./test/classes-regular-expression.css', 'utf8')
      )
    })

    it('includes class names via a predicate', function () {
      assert.include(
        generateSelectors(
          {
            ids: false,
            tagNames: generateSelectors.ignoreDefaultTagNames,
            styles: false,
            classNames: className => className => className.indexOf('default-') === 0,
            markup: testMarkup
          }
        ), fs.readFileSync('./test/classes-predicate.css', 'utf8')
      )
    })

    it('includes ids via a predicate', function () {
      assert.include(
        generateSelectors(
          {
            ids: id => id.indexOf('utility-') === 0,
            tagNames: false,
            classNames: false,
            styles: false,
            markup: testMarkup
          }
        ), fs.readFileSync('./test/ids-predicate.css', 'utf8')
      )
    })

    it('includes ids via a regular expression', function () {
      assert.include(
        generateSelectors(
          {
            ids: /^utility-/,
            tagNames: false,
            classNames: false,
            styles: false,
            markup: testMarkup
          }
        ), fs.readFileSync('./test/ids-regular-expression.css', 'utf8')
      )
    })

    it('appends to input styles and does not duplicate selectors', function () {
      assert.include(
        generateSelectors(
          {
            ids: true,
            tagNames: generateSelectors.ignoreDefaultTagNames,
            classNames: true,
            styles: fs.readFileSync('./test/input-styles.css', 'utf8'),
            markup: testMarkup
          }
        ), fs.readFileSync('./test/appends-without-duplication.css', 'utf8')
      )
    })
  })
})
