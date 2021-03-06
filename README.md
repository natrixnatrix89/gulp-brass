# gulp-brass

[![Build Status](http://img.shields.io/travis/monai/gulp-brass/develop.svg)](https://travis-ci.org/monai/gulp-brass)
[![NPM Version](http://img.shields.io/npm/v/gulp-brass.svg)](https://www.npmjs.org/package/gulp-brass)

Build RPM package.

## How to use

Check out self explanatory [example](/examples/theapp/gulpfile.js).

## RPM

```js
var brass = require('gulp-brass');
var rpm = brass.create(options);
```

### Properties

#### rpm.options

An options object. Inherited from `brass.create(options)` and default options.

### Tasks

#### rpm.setupTask()

A shorthand for `rpm.setup()` stream. Use this.

#### rpm.specTask()

A shorthand for `rpm.spec()` stream.

#### rpm.buildTask()

Runs `rpmbuild` against all spec files in `rpm.buildDir_SPECS` directory.

### Streams

#### rpm.setup()

Creates directory structure required by `rpmbuild`. Use `rpm.setupTask()` task instead.

#### rpm.files()

It registers files to be listed in spec file. All packaged files must be piped to this stream. Always pipe after `gulp.dest()`.

#### rpm.spec()

Renders default spec file. Populates `rpm.options` with `rpm.renderFileList()` output.

#### rpm.build()

Runs `rpmbuild` against piped spec files.

### Methods

#### rpm.renderFileList()

Returns registered files list with inlined attributes as string to be used in `%files` section in spec file.

## Utils

```js
var util = brass.util;
```

### assets(filename)

Returns path to internal [asset](/assets). Intended to use with `gulp.src()`.

### stream(callback)

Returns simplified [`through2.obj`](https://github.com/rvagg/through2) stream.
`callback` arguments are `callback(file, callback)`.

### template(data)

Returns stream that renders piped vinyl objects as templates with provided `data`.
Uses [handlebars](https://www.npmjs.com/package/handlebars) template engine and [handlebars-helper-equal](https://www.npmjs.com/package/handlebars-helper-equal) helper.

### symlink(name, [options])

Returns stream that makes symlinks to `name` path like `$ ln -s target name`.
If name is an array, it iterates to next name with each file.

If `options.deep == true`, makes symlink for each name to each file.
This is convenient when you need to have few symlinks to same file.

## Vinyl extensions

`rpm.renderFileList()` uses some vinyl file object extensions:

- `file.attr = [ mode, user, group ]`, eg. `[ '0777', 'apache', 'apache' ]`
- `file.config = true|false` - indicates that file is config file.
- `file.noreplace = true|false` - sets config file updgrade policy.

More info on `config` and `noreplace` [policy](https://fedoraproject.org/wiki/How_to_create_an_RPM_package#.25files_prefixes).

## License

ISC
