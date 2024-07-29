document.addEventListener('DOMContentLoaded', function () {
	function calculateSize(size) {
		var sufixes = ['B', 'KB', 'MB', 'GB', 'TB'];
		var output = size;
		var q = 0;

		while (size / 1024 > 1) {
			size = size / 1024;
			q++;
		}

		return (Math.round(size * 100) / 100) + ' ' + sufixes[q];
	}

	if (window.location.pathname == '/') {
		document.querySelector('.directory.go-up').style.display = 'none';
	}

	var path = window.location.pathname.split('/');
	var nav = document.querySelector("nav#breadcrumbs ul");
	var pathSoFar = '';

	for (var i = 1; i < path.length - 1; i++) {
		pathSoFar += '/' + decodeURI(path[i]);
		nav.innerHTML += '<li><a href="' + encodeURI(pathSoFar) + '">' + decodeURI(path[i]) + '</a></li>';
	}

	var mtimes = document.querySelectorAll("table#contents td.mtime a");

	for (var i = 0; i < mtimes.length; i++) {
		var mtime = mtimes[i].textContent;
		if (mtime) {
			var d = new Date(mtime);
			mtimes[i].textContent = d.toLocaleString();
		}
	}

	var sizes = document.querySelectorAll("table#contents td.size a");

	for (var i = 0; i < sizes.length; i++) {
		var size = sizes[i].textContent;
		if (size) {
			sizes[i].textContent = calculateSize(parseInt(size));
		}
	}

}, false);
document.addEventListener("DOMContentLoaded", function () {

	var xhr = new XMLHttpRequest();
	xhr.open('GET', document.location, true);
	xhr.send(null);

	xhr.addEventListener('readystatechange', function (e) {
		if (xhr.readyState == 4) {
			var headers = parseHttpHeaders(xhr.getAllResponseHeaders().toLowerCase());

			if (!headers.hasOwnProperty('x-options')) {
				document.body.classList.add('nowebdav');
			}
		}
	});

	var dropArea = document.getElementById('droparea');
	var progressWin = document.getElementById('progresswin');
	var progressBar = document.getElementById('progressbar');
	var progressTrack = [];
	var totalFiles = 0;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
		dropArea.addEventListener(eventName, function (e) {
			e.preventDefault();
			e.stopPropagation();
		}, false);
	});

    ['dragenter', 'dragover'].forEach(eventName => {
		dropArea.addEventListener(eventName, function (e) {
			dropArea.classList.add('highlight');
		}, false);
	});

    ['dragleave', 'drop'].forEach(eventName => {
		dropArea.addEventListener(eventName, function (e) {
			dropArea.classList.remove('highlight')
		}, false);
	});

	document.querySelectorAll('table#contents tr td.actions ul li a[data-action]').forEach(el => {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			var source = event.target || event.srcElement;
			var action = source.getAttribute('data-action');
			var href = source.getAttribute('href');

			if (action == 'delete') {
				deleteFile(href);
			}

		}, false);
	});

	dropArea.addEventListener('drop', function (e) {
		var total = 0;

		for (var i = 0; i < e.dataTransfer.files.length; i++) {
			var file = e.dataTransfer.files[i];
			progressTrack[i] = {
				current: 0
				, max: file.size
			};
			total += file.size;
			totalFiles++;
			uploadFile(file, i);
		}

		progressBar.value = 0;
		progressBar.max = total;
		progressWin.classList.add('show');
	}, false);

	function updateProgress(value, idx) {
		progressTrack[idx].value = value;

		var current = 0;
		for (var i = 0; i < progressTrack.length; i++) {
			current += progressTrack[i].value;
		}

		progressBar.value = current || progressBar.value;
	}

	function uploadFile(file, idx) {
		var xhr = new XMLHttpRequest();
		var formData = new FormData();

		xhr.open('PUT', document.location.href + '/' + file.name, true);
		xhr.upload.addEventListener("progress", function (e) {
			updateProgress(e.loaded, idx);
		});

		xhr.addEventListener('readystatechange', function (e) {
			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201 || xhr.status == 204)) {
				totalFiles--;
			} else if (xhr.readyState == 4) {
				alert(xhr.statusText);
				console.log(xhr);
				totalFiles--;
			}

			if (totalFiles == 0) {
				document.location.reload();
			}
		});

		xhr.setRequestHeader('Content-Type', 'application/octet-stream');
		xhr.send(file);
	}

	function deleteFile(path) {
		if (confirm('Are you sure you want to delete [' + path + ']?')) {
			var xhr = new XMLHttpRequest();
			xhr.open('DELETE', document.location.href + '/' + path, true);
			xhr.send();
			xhr.addEventListener('readystatechange', function (e) {

				if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201 || xhr.status == 204)) {
					document.location.reload();
				}
			});
		}
	}

	function parseHttpHeaders(httpHeaders) {
		return httpHeaders.split("\n").map(x => x.split(/: */, 2)).filter(x => x[0]).reduce((ac, x) => {
			ac[x[0]] = x[1];
			return ac;
		}, {});
	}
});