module.exports = function (grunt) {

	grunt.initConfig({
		typescript: {
			base: {
				src: ['src/**/*.ts'],
				dest: 'bin',
				options: {
					module: 'commonjs', //or commonjs
					target: 'es3', //or es3
					base_path: 'src',
					sourcemap: true,
					fullSourceMapPath: true,
					declaration: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-typescript');

	// Default task(s).
	grunt.registerTask('default', ['typescript']);

};
