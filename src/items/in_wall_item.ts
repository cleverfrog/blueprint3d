import * as THREE from 'three'

import { Model } from "../model/model";
import { Metadata } from "./metadata";
import { WallItem } from "./wall_item";

  /** */
  export abstract class InWallItem extends WallItem {
    constructor(model: Model, metadata: Metadata, geometries: THREE.BufferGeometry[], materials: THREE.MeshStandardMaterial[], root: THREE.Object3D, position: THREE.Vector3, rotation: number, scale: THREE.Vector3) {
      super(model, metadata, geometries, materials, root, position, rotation, scale);
      this.addToWall = true;
    };

    /** */
    public getWallOffset() {
      // fudge factor so it saves to the right wall
      return -this.currentWallEdge.offset + 0.5;
    }
  }
