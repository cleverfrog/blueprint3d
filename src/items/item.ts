import * as THREE from 'three'

import { Model } from '../model/model';
import { Utils } from '../core/utils';
import { Scene } from '../model/scene';
import { Metadata } from "./metadata";
  /**
   * An Item is an abstract entity for all things placed in the scene,
   * e.g. at walls or on the floor.
   */


  const isMaterialArray = (obj: THREE.Material | THREE.Material[]): obj is THREE.Material[] => {
    return ((obj as THREE.Material[]).length !== undefined);
  }

  export abstract class Item extends THREE.Object3D {

    /** */
    public isBP3DItem = true;
    private scene: Scene;

    public boundingBox = new THREE.Box3();
    public boundingBoxHelper = new THREE.BoxHelper(this);

    public materials: THREE.MeshStandardMaterial[];
    public matOrigColors: any[] = new Array();
    /** */
    private errorGlow = new THREE.Object3D();

    /** */
    private hover = false;

    /** */
    private selected = false;

    /** */
    private highlighted = false;

    /** */
    private error = false;

    /** */
    private emissiveColor = 0x444444;

    /** */
    private errorColor = 0xff0000;

    /** */
    private resizable: boolean;

    /** Does this object affect other floor items */
    protected obstructFloorMoves = true;

    /** */
    protected position_set: boolean;

    /** Show rotate option in context menu */
    protected allowRotate = true;

    /** */
    public fixed = false;

    /** dragging */
    private dragOffset = new THREE.Vector3();

    /** */
    protected halfSize: THREE.Vector3;

    geometries: THREE.BufferGeometry[];

    /** Constructs an item. 
     * @param model TODO
     * @param metadata TODO
     * @param geometries TODO
     * @param materials TODO
     * @param root
     * @param position TODO
     * @param rotation TODO
     * @param scale TODO 
     */
    constructor(protected model: Model, public metadata: Metadata, geometries: THREE.BufferGeometry[], materials: THREE.MeshStandardMaterial[], root: THREE.Object3D, position: THREE.Vector3, rotation: number, scale: THREE.Vector3) {
      super();

      this.scene = this.model.scene;
      this.geometries = geometries;
      this.materials = materials;
      this.errorColor = 0xff0000;

      this.resizable = metadata.resizable;

      this.castShadow = true;
      this.receiveShadow = false;


      for(let tChild of root.children) {
        this.add(tChild)
    }
    let i = 0;
    if(this.children.length) {
      for(let c of this.children as any) {
        if(c.type === "Mesh") {
          this.matOrigColors.push([]);
          if(isMaterialArray(c.material)) {
            for(let mat of c.material) {
              this.matOrigColors[i].push(new THREE.Color().copy(mat.color));
            }  
          }
          else {
            this.matOrigColors[i].push(new THREE.Color().copy(c.material.color));
          }
        }
        i++;
      }
    }
    else {
      for(let mat of this.materials) {
        this.matOrigColors.push(new THREE.Color().copy(mat.color));
      }
    }

//      this.computeOverallBoundingBox();
      this.boundingBox.setFromObject(this);
      this.boundingBoxHelper.setFromObject(this);
      let center = new THREE.Vector3();
    // this will give us the actual center in root object space
      this.boundingBox.getCenter(center);
      center.negate();
      
      for(let g of this.geometries) {
        g.applyMatrix4(new THREE.Matrix4().makeTranslation(
          center.x, center.y, center.z));
      }
      
      this.boundingBox.setFromObject(this);
      this.boundingBoxHelper.setFromObject(this);
      // this.geometry.computeBoundingBox();
      // center in its boundingbox
/*      for(let g of this.geometries) {
        g.applyMatrix4(new THREE.Matrix4().makeTranslation(
           - 0.5 * (this.boundingBox.max.x - this.boundingBox.min.x),
           - 0.5 * (this.boundingBox.max.y - this.boundingBox.min.y),
           - 0.5 * (this.boundingBox.max.z - this.boundingBox.min.z)
        ));
      }
*/
      
      // this.geometry.computeBoundingBox();
//      this.computeOverallBoundingBox();
      this.boundingBox.setFromObject(this);  
      this.boundingBoxHelper.setFromObject(this);  

      this.add(this.boundingBoxHelper);

      this.halfSize = this.objectHalfSize();

      if (rotation) {
        this.rotation.y = rotation;
      }

      if (scale != null) {
        this.setScale(scale.x, scale.y, scale.z);
      }
      if (position) {
        this.position.copy(position);
        this.position_set = true;
      } else {
        this.position_set = false;
      }

    };

    /** */
    public removeThisItem() {
      this.scene.removeItem(this);
    };

    /** */
    public resize(height: number, width: number, depth: number) {
      var x = width / this.getWidth();
      var y = height / this.getHeight();
      var z = depth / this.getDepth();
      this.setScale(x, y, z);
    }

    /** */
    public setScale(x: number, y: number, z: number) {
      var scaleVec = new THREE.Vector3(x, y, z);
      this.halfSize.multiply(scaleVec);
      scaleVec.multiply(this.scale)
      this.scale.set(scaleVec.x, scaleVec.y, scaleVec.z);
      this.resized();
      this.scene.needsUpdate = true;
    };

    /** */
    public setFixed(fixed: boolean) {
      this.fixed = fixed;
    }

    /** Subclass can define to take action after a resize. */
    protected abstract resized();

    /** */
    public getHeight = function () {
      return this.halfSize.y * 2.0;
    }

    /** */
    public getWidth = function () {
      return this.halfSize.x * 2.0;
    }

    /** */
    public getDepth = function () {
      return this.halfSize.z * 2.0;
    }

    /** */
    public abstract placeInRoom();

    /** */
    public initObject = function () {
      this.placeInRoom();
      // select and stuff
      this.scene.needsUpdate = true;
    };

    /** */
    public removed() {
    }

    /** on is a bool */
    public updateHighlight() {
      var on = this.hover || this.selected;
      this.highlighted = on;
      var hex = on ? this.emissiveColor : 0x000000;
      // this seems to have been broken anyway - but we need to refactor this for ThreeR159
      let c = 0;
      if(this.children.length) {
        for(let c = 0; c < this.children.length; c++) {
          let child = this.children[c] as any;
          if(child.type !== "Mesh")
            continue;
          if(isMaterialArray(child.material)) {
            let m = 0;
            for(let mat of child.material) {
              mat.color.set(
                this.matOrigColors[c][m].r,
                this.matOrigColors[c][m].g,
                this.matOrigColors[c][m].b);
              m++;
            }
          }
          else {
            let matOrigColor = this.matOrigColors[c];
             matOrigColor = matOrigColor[0];
            child.material.color.set( 
              this.matOrigColors[c][0].r,
              this.matOrigColors[c][0].g,
              this.matOrigColors[c][0].b);
          }
        }
        c++;
      }
      else {
        if(isMaterialArray(this.materials)) {
          for(let i = 0; i < this.materials.length; i++) {
            let mat = this.materials[i];
            if(this.highlighted) {
              mat.color.set(0x00FFFF)
            }
            else {
              mat.color.set(
                this.matOrigColors[i].r,
                this.matOrigColors[i].g,
                this.matOrigColors[i].b);
            }
              mat.needsUpdate = true;
          }
        }
      
/*        for(<THREE.MeshStandardMaterial>this.material).forEach((material) => {
          // TODO_Ekki emissive doesn't exist anymore?
          (<any>material).emissive.setHex(hex);
        } )*/;
    }
    }

    /** */
    public mouseOver() {
      this.hover = true;
      this.updateHighlight();
    };

    /** */
    public mouseOff() {
      this.hover = false;
      this.updateHighlight();
    };

    /** */
    public setSelected() {
      this.selected = true;
      this.updateHighlight();
    };

    /** */
    public setUnselected() {
      this.selected = false;
      this.updateHighlight();
    };

    /** intersection has attributes point (vec3) and object (THREE.Mesh) */
    public clickPressed(intersection) {
      this.dragOffset.copy(intersection.point).sub(this.position);
    };

    /** */
    public clickDragged(intersection) {
      if (intersection) {
        this.moveToPosition(
          intersection.point.sub(this.dragOffset),
          intersection);
      }
    };

    /** */
    public rotate(intersection) {
      if (intersection) {
        var angle = Utils.angle(
          0,
          1,
          intersection.point.x - this.position.x,
          intersection.point.z - this.position.z);

        var snapTolerance = Math.PI / 16.0;

        // snap to intervals near Math.PI/2
        for (var i = -4; i <= 4; i++) {
          if (Math.abs(angle - (i * (Math.PI / 2))) < snapTolerance) {
            angle = i * (Math.PI / 2);
            break;
          }
        }

        this.rotation.y = angle;
      }
    }

    /** */
    public moveToPosition(vec3, intersection) {
      this.position.copy(vec3);
    }

    /** */
    public clickReleased() {
      if (this.error) {
        this.hideError();
      }
    };

    /**
     * Returns an array of planes to use other than the ground plane
     * for passing intersection to clickPressed and clickDragged
     */
    public customIntersectionPlanes() {
      return [];
    }

    public computeOverallBoundingBox() {
      let g: THREE.BufferGeometry;
      let min = new THREE.Vector3;
      let max = new THREE.Vector3;

      for(g of this.geometries) {
          g.computeBoundingBox();
		    if(g.boundingBox.min.x < min.x)
  				min.x = g.boundingBox.min.x;
    		if(g.boundingBox.max.x > max.x)
			  	max.x = g.boundingBox.max.x;
	    	if(g.boundingBox.min.y < min.y)
				  min.y = g.boundingBox.min.y;
		    if(g.boundingBox.max.y > max.y)
				  max.y = g.boundingBox.max.y;
		    if(g.boundingBox.min.z < min.z)
				  min.z = g.boundingBox.min.z;
		    if(g.boundingBox.max.z > max.z)
				  max.z = g.boundingBox.max.z;
	    }
      this.boundingBox = new THREE.Box3(min, max);
    }

    /** 
     * returns the 2d corners of the bounding polygon
     * 
     * offset is Vector3 (used for getting corners of object at a new position)
     * 
     * TODO: handle rotated objects better!
     */
    public getCorners(xDim, yDim, position) {

      position = position || this.position;

      var halfSize = this.halfSize.clone();

      var c1 = new THREE.Vector3(-halfSize.x, 0, -halfSize.z);
      var c2 = new THREE.Vector3(halfSize.x, 0, -halfSize.z);
      var c3 = new THREE.Vector3(halfSize.x, 0, halfSize.z);
      var c4 = new THREE.Vector3(-halfSize.x, 0, halfSize.z);

      var transform = new THREE.Matrix4();
      //console.log(this.rotation.y);
      transform.makeRotationY(this.rotation.y); //  + Math.PI/2)

      c1.applyMatrix4(transform);
      c2.applyMatrix4(transform);
      c3.applyMatrix4(transform);
      c4.applyMatrix4(transform);

      c1.add(position);
      c2.add(position);
      c3.add(position);
      c4.add(position);

      //halfSize.applyMatrix4(transform);

      //var min = position.clone().sub(halfSize);
      //var max = position.clone().add(halfSize);

      var corners = [
        { x: c1.x, y: c1.z },
        { x: c2.x, y: c2.z },
        { x: c3.x, y: c3.z },
        { x: c4.x, y: c4.z }
      ];

      return corners;
    }

    /** */
    public abstract isValidPosition(vec3): boolean;

    /** */
    public showError(vec3) {
      vec3 = vec3 || this.position;
      if (!this.error) {
        this.error = true;
        this.errorGlow = this.createGlow(this.errorColor, 0.8, true);
        this.scene.add(this.errorGlow as any);
      }
      this.errorGlow.position.copy(vec3);
    }

    /** */
    public hideError() {
      if (this.error) {
        this.error = false;
        this.scene.remove(this.errorGlow as any);
      }
    }

    /** */
    private objectHalfSize(): THREE.Vector3 {
      var objectBox = new THREE.Box3();
      objectBox.setFromObject(<any>this);
      // check logic of typing this 'any'
      return objectBox.max.clone().sub(objectBox.min).divideScalar(2);
    }

    /** */
    public createGlow(color, opacity, ignoreDepth): THREE.Object3D {
      ignoreDepth = ignoreDepth || false
      opacity = opacity || 0.2;
      var glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        blending: THREE.AdditiveBlending,
        opacity: 0.2,
        transparent: true,
        depthTest: !ignoreDepth
      });

      var glow = new THREE.Object3D();
      let child: any;
      for(child of this.children) {
        let tChild = new THREE.Mesh().clone(child);
        tChild.traverse(function(kid : THREE.Mesh) {
          kid.material = glowMaterial;
        });
        glow.add(tChild);
      }
      glow.position.copy(this.position);
      glow.rotation.copy(this.rotation);
      glow.scale.copy(this.scale);
      return glow;
    };
  }

