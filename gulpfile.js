var gulp = require('gulp');
var path = require('path');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var symlink = require('gulp-symlink');
var through = require('through2');
var brass = require('./index');
var util = require('util');

var rpm = brass.create({
    type: 'rpm',
    workDir: '.',
    name: 'theapp',
    version: '0.0.1',
    release: 1,
    license: 'ISC',
    group: 'Applications/Internet',
    source: 'theapp-0.0.1.tgz',
    summary: 'The App',
    description: 'This is the application'
});

gulp.task('clean', function () {
    return gulp.src(rpm.buildDir, { read: false })
    .pipe(through.obj(function (file, enc, callback) {
        this.push(file);
        rimraf(file.path, callback);
    }));
});

gulp.task('rpm-setup', [  'clean' ], rpm.setupTask());

gulp.task('rpm-files', [ 'rpm-setup' ], function () {
    return gulp.src([
        'package/*',
        'package/bin/**/*',
        'package/assets/**/*',
        'package/node_modules/**/*',
        '!package/config',
        '!package/var',
    ], { mark: true, base: 'package' })
    .pipe(gulp.dest(path.join(rpm.buildRoot, '/usr/lib/theapp')))
    .pipe(rpm.files());
});

gulp.task('rpm-service', [ 'rpm-setup' ], function () {
    var systemd = brass.service.create({
        type: 'systemd',
        name: 'theapp',
        description: rpm.options.description,
        target: '/usr/lib/theapp/bin/theapp',
        user: 'vagrant',
        group: 'vagrant'
    });
    
    return gulp.src(brass.util.assets('service/systemd'))
    .pipe(systemd.file())
    .pipe(gulp.dest(path.join(rpm.buildRoot, '/lib/systemd/system')))
    .pipe(rpm.files());
});

// gulp.task('rpm-spec', [ 'rpm-files' ], function () {
//     return gulp.src(brass.util.assets('rpm/spec'))
//     .pipe(rpm.spec())
//     .pipe(gulp.dest(rpm.buildDir_SPECS));
// });

gulp.task('rpm-spec', [ 'rpm-files' ], rpm.specTask());
 
// gulp.task('rpm-build', [ 'rpm-setup', 'rpm-files', 'rpm-spec' ], function () {
//     return gulp.src(path.join(rpm.buildDir_SPECS, '*'), { read: false })
//     .pipe(rpm.build());
// });

gulp.task('rpm-build', [ 'rpm-setup', 'rpm-files', 'rpm-service', 'rpm-spec' ], rpm.buildTask());

gulp.task('build', [ 'rpm-setup', 'rpm-files', 'rpm-spec', 'rpm-service', 'rpm-build' ], function () {
    console.log('build finished');
});

gulp.task('default', [ 'build' ]);
