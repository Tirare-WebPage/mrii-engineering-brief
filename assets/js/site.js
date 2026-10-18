(function () {
  'use strict';

  // Keep media placeholders visible until local assets load. CAD stages accept either
  // an interactive GLB or a matching still-render fallback when a GLB is unavailable.
  document.querySelectorAll('[data-user-media]').forEach(function (box) {
    var model = box.querySelector('model-viewer');
    var video = box.querySelector('video');
    var image = box.querySelector('.evolution-fallback');
    var plainImage = !model && !video ? box.querySelector('img') : null;

    function showImageFallback() {
      if (!image) return;
      if (image.complete && image.naturalWidth > 0) {
        box.classList.remove('loaded');
        box.classList.add('image-loaded');
      } else {
        image.addEventListener('load', function () {
          if (!box.classList.contains('loaded')) box.classList.add('image-loaded');
        }, { once: true });
      }
    }

    if (model) {
      model.addEventListener('load', function () {
        box.classList.add('loaded');
        box.classList.remove('image-loaded');
      });
      model.addEventListener('error', showImageFallback);
      if (image) {
        image.addEventListener('load', function () {
          if (!box.classList.contains('loaded')) box.classList.add('image-loaded');
        });
        image.addEventListener('error', function () { box.classList.remove('image-loaded'); });
        if (image.complete && image.naturalWidth > 0) box.classList.add('image-loaded');
      }
      return;
    }
    if (video) {
      video.addEventListener('loadedmetadata', function () { box.classList.add('loaded'); });
      video.addEventListener('error', function () { box.classList.remove('loaded'); });
      return;
    }
    if (plainImage) {
      plainImage.addEventListener('load', function () {
        if (plainImage.naturalWidth > 0) box.classList.add('loaded');
      });
      plainImage.addEventListener('error', function () { box.classList.remove('loaded'); });
      if (plainImage.complete && plainImage.naturalWidth > 0) box.classList.add('loaded');
    }
  });

  // Source-linked product photos degrade gracefully if a host blocks embedding.
  document.querySelectorAll('img[data-source-image]').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.dataset.failed === 'true') return;
      img.dataset.failed = 'true';
      var fallback = document.createElement('div');
      fallback.className = 'photo-fallback';
      var label = img.alt || 'Reference image';
      fallback.textContent = label;
      var source = img.closest('figure') || img.parentElement;
      if (source) source.replaceChild(fallback, img);
    });
  });

  // Local media setup mode: add ?media=edit to preview a file in any media slot.
  // Files are loaded from the browser's File object; this does not upload or save them.
  var mediaSetupMode = new URLSearchParams(window.location.search).get('media') === 'edit';
  if (mediaSetupMode) {
    document.body.classList.add('media-edit-mode');
    var banner = document.createElement('div');
    banner.className = 'media-edit-banner';
    banner.innerHTML = '<strong>MEDIA SETUP MODE</strong><span>Choose a file inside a slot to preview it immediately. This is a temporary local preview; it does not save the file to the site.</span><a href="' + window.location.pathname + window.location.hash + '">Exit setup</a>';
    document.body.insertBefore(banner, document.body.firstChild);

    var activeObjectUrls = [];
    var previewCounter = 0;

    function inferKind(file) {
      var name = (file.name || '').toLowerCase();
      if (/\.(glb|gltf)$/.test(name)) return 'model';
      if (/\.(mp4|m4v|webm|mov|ogv)$/.test(name) || (file.type && file.type.indexOf('video/') === 0)) return 'video';
      if (/\.(jpg|jpeg|png|webp|gif|avif)$/.test(name) || (file.type && file.type.indexOf('image/') === 0)) return 'image';
      return 'unknown';
    }

    function getOrCreatePreviewImage(box) {
      var img = box.querySelector('.evolution-fallback') || box.querySelector('img:not(.media-empty img)');
      if (img) return img;
      img = box.querySelector('.local-preview-image');
      if (!img) {
        img = document.createElement('img');
        img.className = 'local-preview-image';
        img.alt = 'Temporary local media preview';
        img.loading = 'eager';
        box.insertBefore(img, box.querySelector('.media-empty'));
      }
      return img;
    }

    function renderFileIntoBox(file, url, box) {
      var kind = inferKind(file);
      var model = box.querySelector('model-viewer');
      var video = box.querySelector('video');
      var isEvolution = box.classList.contains('evolution-media');
      var hasStillFallback = !!box.querySelector('.evolution-fallback');

      if (kind === 'model') {
        if (!model) {
          banner.querySelector('span').textContent = file.name + ' is a 3D model, but this slot is not configured for 3D. Choose a GLB for a CAD slot.';
          return;
        }
        box.classList.remove('loaded', 'image-loaded', 'local-image-loaded');
        model.addEventListener('load', function () {
          box.classList.add('loaded');
          box.classList.remove('image-loaded', 'local-image-loaded');
          updateBanner(file.name + ' loaded as an interactive 3D model. Preview only; not saved to the site.');
        }, { once: true });
        model.addEventListener('error', function () {
          updateBanner('The browser could not load ' + file.name + '. Export as .glb (preferred) and try again.');
        }, { once: true });
        model.setAttribute('src', url);
        return;
      }

      if (kind === 'video') {
        if (!video) {
          video = document.createElement('video');
          video.controls = true;
          video.playsInline = true;
          video.preload = 'metadata';
          video.setAttribute('aria-label', 'Temporary local video preview');
          var emptySlot = box.querySelector('.media-empty');
          box.insertBefore(video, emptySlot || null);
        }
        box.classList.remove('loaded', 'image-loaded', 'local-image-loaded');
        video.addEventListener('loadedmetadata', function () {
          box.classList.add('loaded');
          updateBanner(file.name + ' loaded as a video. Preview only; not saved to the site.');
        }, { once: true });
        video.addEventListener('error', function () {
          updateBanner('The browser could not play ' + file.name + '. Try MP4 with H.264 video and AAC audio.');
        }, { once: true });
        video.src = url;
        video.load();
        return;
      }

      if (kind === 'image') {
        var img = getOrCreatePreviewImage(box);
        img.src = url;
        img.alt = file.name;
        img.addEventListener('load', function () {
          if (hasStillFallback || isEvolution) {
            box.classList.remove('loaded', 'local-image-loaded');
            box.classList.add('image-loaded');
          } else if (box.classList.contains('media-render')) {
            box.classList.add('loaded');
          } else {
            box.classList.add('local-image-loaded');
            box.classList.remove('loaded', 'image-loaded');
          }
          updateBanner(file.name + ' loaded as an image. Preview only; not saved to the site.');
        }, { once: true });
        img.addEventListener('error', function () {
          updateBanner('Could not preview ' + file.name + '. Try JPG, PNG or WebP.');
        }, { once: true });
        return;
      }

      updateBanner('Unsupported file type: ' + file.name + '. Use GLB for 3D, JPG/PNG/WebP for images, or MP4/WebM for video.');
    }

    function updateBanner(message) {
      var span = banner.querySelector('span');
      if (span) span.textContent = message;
    }

    document.querySelectorAll('[data-user-media]').forEach(function (box) {
      var empty = box.querySelector('.media-empty');
      if (!empty) return;
      var pickerLabel = document.createElement('label');
      pickerLabel.className = 'media-picker-label';
      pickerLabel.textContent = 'Choose file to preview';
      var picker = document.createElement('input');
      picker.type = 'file';
      picker.accept = '.glb,.gltf,.jpg,.jpeg,.png,.webp,.gif,.avif,.mp4,.m4v,.webm,.mov,.ogv';
      picker.setAttribute('aria-label', 'Choose a local file for this media slot');
      pickerLabel.appendChild(picker);
      empty.appendChild(pickerLabel);

      picker.addEventListener('change', function () {
        var file = picker.files && picker.files[0];
        if (!file) return;
        var url = URL.createObjectURL(file);
        activeObjectUrls.push(url);
        renderFileIntoBox(file, url, box);

        // For the baseline tricycle, update both references if the same model is selected.
        var key = box.getAttribute('data-user-media');
        if (key === 'reference-trike.glb') {
          document.querySelectorAll('[data-user-media="reference-trike.glb"]').forEach(function (other) {
            if (other === box) return;
            renderFileIntoBox(file, url, other);
          });
        }
        if (key === 'reference-trike-render.jpg') {
          document.querySelectorAll('img[src="assets/user/reference-trike-render.jpg"]').forEach(function (otherImg) {
            otherImg.src = url;
            var parent = otherImg.closest('.evolution-media');
            if (parent) parent.classList.add('image-loaded');
            var renderParent = otherImg.closest('.media-render');
            if (renderParent) renderParent.classList.add('loaded');
          });
        }
      });
    });
  }

  // A quiet active-section cue in the navigation, without taking control away from the reader.
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a[href^="#"]'));
  var targets = navLinks.map(function (link) { return document.querySelector(link.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-22% 0px -68% 0px', threshold: 0 });
    targets.forEach(function (target) { observer.observe(target); });
  }
})();
