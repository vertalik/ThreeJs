import * as THREE from 'three';

export default class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, modelsArr, camera) {
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }

    this.raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = this.raycaster.intersectObjects(modelsArr);
    if (intersectedObjects.length) {
      this.pickedObject = intersectedObjects[0].object;
      if (this.pickedObject) {
        this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
        this.pickedObject.material.emissive.setHex(0xff0000);
      }
    }
  }
}
