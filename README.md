# generate-selectors

Version 1.0.0.

`generateSelectors` is function which produces an shell of empty CSS selectors from markup. It is intended to be used in front-end development workflows. It also exists as a Gulp plugin.

## Usage

`generateSelectors` accepts a single options parameter and returns a string. The result is intended to be used as the content of a stylesheet file.

```stylesheet = generateSelectors( options )```

### Options

- `ids` (`Boolean`|`RegExp`|`Function`) Instructions for generating id specifiers. Defaults to `true`.
- `classNames` (`Boolean`|`RegExp`|`Function`) Instructions for generating class name specifiers. Defaults to `true`.
- `tagNames` (`Boolean`|`RegExp`|`Function`) Instructions for generating tag names specifiers. Defaults to `generateSelectors.ignoreDefaultTagNames`.
- `styles`(`false`|`String`) The existing stylesheet contents. Use of this option prevents both existing stylesheet content from being lost and duplicate selectors from being generated. Defaults to `false`, which assumes that an entirely new stylesheet is to be generated.
- `markup` (`String`) The markup from which to generate the selectors. Required.

#### Instructions for types of specifiers

- Booleans. `true` indicates to include all specifiers of this type, `false` indicates to skip this type of specifiers.
- Regular Expressions include or exclude specific specifiers via the `.match()` method. For example, `/^utility-/` would require that any specifiers start with `'utility-'` in order to be included.
- Functions include or exclude specific specifiers by acting as predicates. They accept the specifier as as string and return a boolean, `true` to include or `false` to exclude.

#### Behavior

`generateSelectors` combines all specifiers which it finds on an element into a single, compound selector. For example, `<ul class="navigation" id="main-navigation">` might result in `ul#main-navigation.navigation`.

### Default ignored tag names

The built-in predicate function `generateSelectors.ignoreDefaultTagNames` is controlled by the array `generateSelectors.defaultIgnoredTagNames`. If, for example, you wanted to add `ul` and `li` to the list of ignored tag names, you could write:

```generateSelectors.defaultIgnoredTagNames = generateSelectors.defaultIgnoredTagNames.concat ( 'ul', 'li' )```
