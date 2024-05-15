import * as THREE from 'three'

import { Model } from "../model/model";
import { InWallItem } from "./in_wall_item";
import { Metadata } from "./metadata";

  /** */
  export abstract class InWallFloorItem extends InWallItem {
    constructor(model: Model, metadata: Metadata, geometries: THREE.BufferGeometry[], materials: THREE.MeshStandardMaterial[], root: THREE.Object3D, position: THREE.Vector3, rotation: number, scale: THREE.Vector3) {
      super(model, metadata, geometries, materials, root, position, rotation, scale);
      this.boundToFloor = true;
    };
  }
