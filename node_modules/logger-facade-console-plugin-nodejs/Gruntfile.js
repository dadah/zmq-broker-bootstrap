module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: '<%= jshint.files %>',
      tasks: ['test']
    },

    jshint: {
      files: ['Gruntfile.js', 'index.js', 'spec/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        jquery: true,
        globals: {
          _: false,
          console: false,
          expect: false,
          describe: false,
          xdescribe: false,
          before: false,
          beforeEach: false,
          afterEach: false,
          it: false,
          xit: false,
          setup: false,
          suite: false,
          teardown: false,
          test: false,
          jasmine: false,
          module: false,
          spyOn: false,
          require: false,
          __dirname: false,
          waits: false,
          waitsFor: false,
          runs: false,
          exports: false,
          process: false
        }
      }
    },

    jasmine_node: {
      coverage: {
        options : {
          failTask: true,
          branches : 100 ,
          functions: 100,
          statements: 100,
          lines: 100
        }
      },
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: '_spec'
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node-coverage-validation');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  var instrumentationFilePath = './instrumentation_spec.js';
  var fs = require('fs');
  var fsTools = require('fs-tools');

  grunt.registerTask('gen-instrumentation-file', function() {
    if(fs.existsSync(instrumentationFilePath)){
      // remove file if exists
      fs.unlinkSync(instrumentationFilePath);
    }

    // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file
    var file = fs.createWriteStream(instrumentationFilePath, {'flags': 'a'});
    grunt.log.writeln('generating instrumentation file: %s', instrumentationFilePath);

    var srcPath = './';
    grunt.log.writeln("Source Path to walk: %s", srcPath);

    var specMatcher = grunt.config.data.jasmine_node.options.specNameMatcher;

    var filecheck = function(path){
      var isModule = path.indexOf('node_modules') === 0;
      var isCoverage = path.indexOf('coverage') === 0;
      var isGruntfile = path === 'Gruntfile.js';
      var isSpec = path.indexOf(specMatcher) !== -1;

      if(isModule || isCoverage || isGruntfile || isSpec) {
        return;
      }

      grunt.log.writeln("require file ./%s", path);

      file.write('require("./' + path + '");\n');
    };

    fsTools.walkSync(srcPath, '.js$', function(path,stats,callback){
      filecheck(path);
    });

    grunt.log.ok('generated %s', instrumentationFilePath);
  });

  grunt.registerTask('default', 'watch');
  grunt.registerTask('test', ['jshint', 'gen-instrumentation-file', 'jasmine_node']);

};
