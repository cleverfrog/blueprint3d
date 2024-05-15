import * as THREE from 'three'

import { Model } from "../model/model";
import { FloorItem } from "./floor_item";
import { Metadata } from "./metadata";

  /** */
  export abstract class OnFloorItem extends FloorItem {
    constructor(model: Model, metadata: Metadata, geometries: THREE.BufferGeometry[], materials: THREE.MeshStandardMaterial[], root: THREE.Object3D, position: THREE.Vector3, rotation: number, scale: THREE.Vector3) {
      super(model, metadata, geometries, materials, root, position, rotation, scale);
      this.obstructFloorMoves = false;
      this.receiveShadow = true;
    };
  }
