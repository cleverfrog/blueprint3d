import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
/// <reference path="../../lib/jQuery.d.ts" />

import { Factory } from "../items/factory";
import { Item } from "../items/item"
import { Model } from "../model/model";
import { Utils } from "../core/utils"
  /**
   * The Scene is a manager of Items and also links to a ThreeJS scene.
   */
  export class Scene {

    /** The associated ThreeJS scene. */
    private scene: THREE.Scene;

    /** */
    private items: Item[] = [];

    /** */
    public needsUpdate = false;

    /** The Json loader. */
    private loader: GLTFLoader;

    /** */
    private itemLoadingCallbacks = $.Callbacks();

    /** Item */
    private itemLoadedCallbacks = $.Callbacks();

    /** Item */
    private itemRemovedCallbacks = $.Callbacks();

    /**
     * Constructs a scene.
     * @param model The associated model.
     * @param textureDir The directory from which to load the textures.
     */
    constructor(private model: Model, private textureDir: string) {
      this.scene = new THREE.Scene();

      // init item loader
      this.loader = new GLTFLoader();
      this.loader.crossOrigin = "";
    }

    /** Adds a non-item, basically a mesh, to the scene.
     * @param mesh The mesh to be added.
     */
    public add(mesh: THREE.Mesh) {
      this.scene.add(mesh);
    }

    /** Removes a non-item, basically a mesh, from the scene.
     * @param mesh The mesh to be removed.
     */
    public remove(mesh: THREE.Mesh) {
      this.scene.remove(mesh);
      Utils.removeValue(this.items, mesh);
    }

    /** Gets the scene.
     * @returns The scene.
     */
    public getScene(): THREE.Scene {
      return this.scene;
    }

    /** Gets the items.
     * @returns The items.
     */
    public getItems(): Item[] {
      return this.items;
    }

    /** Gets the count of items.
     * @returns The count.
     */
    public itemCount(): number {
      return this.items.length
    }

    /** Removes all items. */
    public clearItems() {
      var items_copy = this.items
      var scope = this;
      this.items.forEach((item) => {
        scope.removeItem(item, true);
      });
      this.items = []
    }

    /**
     * Removes an item.
     * @param item The item to be removed.
     * @param dontRemove If not set, also remove the item from the items list.
     */
//    ChangedForR159
    public removeItem(item: Item, dontRemove?: boolean) {
//
      dontRemove = dontRemove || false;
      // use this for item meshes
      this.itemRemovedCallbacks.fire(item);
      item.removed();
      this.scene.remove(<any>item);
      if (!dontRemove) {
        Utils.removeValue(this.items, item);
      }
    }

    /**
     * Creates an item and adds it to the scene.
     * @param itemType The type of the item given by an enumerator.
     * @param fileName The name of the file to load.
     * @param metadata TODO
     * @param position The initial position.
     * @param rotation The initial rotation around the y axis.
     * @param scale The initial scaling.
     * @param fixed True if fixed.
     */
    public addItem(itemType: number, fileName: string, metadata, position: THREE.Vector3, rotation: number, scale: THREE.Vector3, fixed: boolean) {
      itemType = itemType || 1;
      var scope = this;
      // Below allows for extracting single mesh from sketchfab hierarchy
      var loaderCallback = function (data: any) {
          let mesh;
          if(data.scene.children[0].type === "Mesh") {
            mesh = data.scene.children[0];              
          }
          else {
              data.scene.children[0].traverse(function (tObj) {
                if(tObj.type === "Mesh") {
                    mesh = tObj;
                  return;
                }
              });              
          }
          
        var item = new (Factory.getClass(itemType))(
          scope.model,
          metadata, mesh.geometry,
          mesh.material,
          position, rotation, scale
        );
        item.fixed = fixed || false;
        scope.items.push(item);
        scope.add(item);
        item.initObject();
        scope.itemLoadedCallbacks.fire(item);
      }

      this.itemLoadingCallbacks.fire();
      this.loader.load(
        fileName,
        loaderCallback,
        undefined // TODO_Ekki 
      );
    }
  }

