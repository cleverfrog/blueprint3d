import * as THREE from 'three'

import { Model } from "../model/model";
import { Metadata } from "./metadata";
import { WallItem } from "./wall_item";

  /** */
  export abstract class WallFloorItem extends WallItem {
    constructor(model: Model, metadata: Metadata, geometries: THREE.BufferGeometry[], materials: THREE.MeshStandardMaterial[], root: THREE.Object3D, position: THREE.Vector3, rotation: number, scale: THREE.Vector3) {
      super(model, metadata, geometries, materials, root, position, rotation, scale);
      this.boundToFloor = true;
    };
  }
