import * as THREE from 'three'
var updateShadowCamera;

  export var Lights = function (scene, floorplan) {

    var scope = this;
    var scene = scene;
    var floorplan = floorplan;

    var tol = 1;
    var height = 300; // TODO: share with Blueprint.Wall

    var dirLight;

    this.getDirLight = function () {
      return dirLight;
    }

    function init() {
       /* tslint:disable-next-line */
      var light = new THREE.HemisphereLight(0xffffff, 0x888888, 0.6);
      light.position.set(0, height, 0);
      scene.add(light);

      dirLight = new THREE.DirectionalLight(0xffffff, 2);
      dirLight.color.setRGB(1, 1, 1);

      dirLight.castShadow = true;

      dirLight.shadowMapWidth = 1024;
      dirLight.shadowMapHeight = 1024;

      dirLight.shadowCameraFar = height + tol;
      dirLight.shadowBias = -0.0001;
      dirLight.shadowDarkness = 0.2;
      dirLight.visible = true;
      dirLight.shadowCameraVisible = false;

      scene.add(dirLight);
      scene.add(dirLight.target);

      floorplan.fireOnUpdatedRooms(updateShadowCamera);
    }

    this.updateShadowCamera = function() {

      var size = floorplan.getSize();
      var d = (Math.max(size.z, size.x) + tol) / 2.0;

      var center = floorplan.getCenter();
      var pos = new THREE.Vector3(
        center.x, height, center.z);
      dirLight.position.copy(pos);
      dirLight.target.position.copy(center);
      //dirLight.updateMatrix();
      //dirLight.updateWorldMatrix()
      dirLight.shadowCameraLeft = -d;
      dirLight.shadowCameraRight = d;
      dirLight.shadowCameraTop = d;
      dirLight.shadowCameraBottom = -d;
      // this is necessary for updates
      if (dirLight.shadowCamera) {
        dirLight.shadowCamera.left = dirLight.shadowCameraLeft;
        dirLight.shadowCamera.right = dirLight.shadowCameraRight;
        dirLight.shadowCamera.top = dirLight.shadowCameraTop;
        dirLight.shadowCamera.bottom = dirLight.shadowCameraBottom;
        dirLight.shadowCamera.updateProjectionMatrix();
      }
    }
updateShadowCamera = this.updateShadowCamera;
    init();
  }
