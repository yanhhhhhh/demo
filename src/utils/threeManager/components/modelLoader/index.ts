import { Space } from "./../../index";
import * as THREE from "three";

import { TGALoader } from "three/addons/loaders/TGALoader.js";

import { AddObjectCommand } from "./commands/AddObjectCommand.js";
import { LoaderUtils } from "./LoaderUtils.js";
class ModelLoader {
  manager: THREE.LoadingManager;
  constructor(private space: Space) {
    this.manager = new THREE.LoadingManager();
  }
  load(url: string) {
    const loader = new THREE.FileLoader(this.manager);
    loader.load(url, (data) => {
      console.log(data);
    });
  }

  // loadFile(file: File, manager: THREE.LoadingManager): void;
}

export default ModelLoader;
export { ModelLoader };

function Loader(Space: Space) {
  const scope = this;

  this.texturePath = "";

  this.loadFiles = function (files, filesMap) {
    if (files.length > 0) {
      filesMap = filesMap || LoaderUtils.createFilesMap(files);

      const manager = new THREE.LoadingManager();
      manager.setURLModifier(function (url) {
        url = url.replace(/^(\.?\/)/, ""); // remove './'

        const file = filesMap[url];

        if (file) {
          console.log("Loading", url);

          return URL.createObjectURL(file);
        }

        return url;
      });

      manager.addHandler(/\.tga$/i, new TGALoader());

      for (let i = 0; i < files.length; i++) {
        scope.loadFile(files[i], manager);
      }
    }
  };

  this.loadFile = function (file, manager) {
    const filename = file.name;
    const extension = filename.split(".").pop().toLowerCase();

    const reader = new FileReader();
    reader.addEventListener("progress", function (event) {
      const size = "(" + Math.floor(event.total / 1000).format() + " KB)";
      const progress = Math.floor((event.loaded / event.total) * 100) + "%";

      console.log("Loading", filename, size, progress);
    });

    switch (extension) {
      case "3dm": {
        reader.addEventListener(
          "load",
          async function (event) {
            const contents = event.target.result;

            const { Rhino3dmLoader } = await import(
              "three/addons/loaders/3DMLoader.js"
            );

            const loader = new Rhino3dmLoader();
            loader.setLibraryPath("../examples/jsm/libs/rhino3dm/");
            loader.parse(
              contents,
              function (object) {
                object.name = filename;

                // editor.execute( new AddObjectCommand( editor, object ) );
              },
              function (error) {
                console.error(error);
              }
            );
          },
          false
        );
        reader.readAsArrayBuffer(file);

        break;
      }

      case "3ds": {
        reader.addEventListener(
          "load",
          async function (event) {
            const { TDSLoader } = await import(
              "three/addons/loaders/TDSLoader.js"
            );

            const loader = new TDSLoader();
            const object = loader.parse(event.target.result);

            // editor.execute( new AddObjectCommand( editor, object ) );
          },
          false
        );
        reader.readAsArrayBuffer(file);

        break;
      }

      case "3mf": {
        reader.addEventListener(
          "load",
          async function (event) {
            const { ThreeMFLoader } = await import(
              "three/addons/loaders/3MFLoader.js"
            );

            const loader = new ThreeMFLoader();
            const object = loader.parse(event.target.result);

            // editor.execute( new AddObjectCommand( editor, object ) );
          },
          false
        );
        reader.readAsArrayBuffer(file);

        break;
      }

      case "amf": {
        reader.addEventListener(
          "load",
          async function (event) {
            const { AMFLoader } = await import(
              "three/addons/loaders/AMFLoader.js"
            );

            const loader = new AMFLoader();
            const amfobject = loader.parse(event.target.result);

            // editor.execute( new AddObjectCommand( editor, amfobject ) );
          },
          false
        );
        reader.readAsArrayBuffer(file);

        break;
      }

      case "drc": {
        reader.addEventListener(
          "load",
          async function (event) {
            const contents = event.target.result;

            const { DRACOLoader } = await import(
              "three/addons/loaders/DRACOLoader.js"
            );

            const loader = new DRACOLoader();
            loader.setDecoderPath("../examples/jsm/libs/draco/");
            loader.parse(contents, function (geometry) {
              let object;

              if (geometry.index !== null) {
                const material = new THREE.MeshStandardMaterial();

                object = new THREE.Mesh(geometry, material);
                object.name = filename;
              } else {
                const material = new THREE.PointsMaterial({ size: 0.01 });
                material.vertexColors = geometry.hasAttribute("color");

                object = new THREE.Points(geometry, material);
                object.name = filename;
              }

              loader.dispose();
              editor.execute(new AddObjectCommand(editor, object));
            });
          },
          false
        );
        reader.readAsArrayBuffer(file);

        break;
      }

      case "fbx": {
        reader.addEventListener(
          "load",
          async function (event) {
            const contents = event.target.result;

            const { FBXLoader } = await import(
              "three/addons/loaders/FBXLoader.js"
            );

            const loader = new FBXLoader(manager);
            const object = loader.parse(contents);

            editor.execute(new AddObjectCommand(editor, object));
          },
          false
        );
        reader.readAsArrayBuffer(file);

        break;
      }

      case "glb": {
        reader.addEventListener(
          "load",
          async function (event) {
            const contents = event.target.result;

            const { GLTFLoader } = await import(
              "three/addons/loaders/GLTFLoader.js"
            );
            const { DRACOLoader } = await import(
              "three/addons/loaders/DRACOLoader.js"
            );
            const { KTX2Loader } = await import(
              "three/addons/loaders/KTX2Loader.js"
            );
            const { MeshoptDecoder } = await import(
              "three/addons/libs/meshopt_decoder.module.js"
            );

            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath("../examples/jsm/libs/draco/gltf/");

            const ktx2Loader = new KTX2Loader();
            ktx2Loader.setTranscoderPath("../examples/jsm/libs/basis/");

            const loader = new GLTFLoader();
            loader.setDRACOLoader(dracoLoader);
            loader.setKTX2Loader(ktx2Loader);
            loader.setMeshoptDecoder(MeshoptDecoder);
            loader.parse(contents, "", function (result) {
              const scene = result.scene;
              scene.name = filename;

              scene.animations.push(...result.animations);
              editor.execute(new AddObjectCommand(editor, scene));

              dracoLoader.dispose();
            });
          },
          false
        );
        reader.readAsArrayBuffer(file);

        break;
      }

      case "gltf": {
        reader.addEventListener(
          "load",
          async function (event) {
            const contents = event.target.result;

            const { DRACOLoader } = await import(
              "three/addons/loaders/DRACOLoader.js"
            );
            const { GLTFLoader } = await import(
              "three/addons/loaders/GLTFLoader.js"
            );
            const { KTX2Loader } = await import(
              "three/addons/loaders/KTX2Loader.js"
            );
            const { MeshoptDecoder } = await import(
              "three/addons/libs/meshopt_decoder.module.js"
            );

            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath("../examples/jsm/libs/draco/gltf/");

            const ktx2Loader = new KTX2Loader();
            ktx2Loader.setTranscoderPath("../examples/jsm/libs/basis/");

            const loader = new GLTFLoader(manager);
            loader.setDRACOLoader(dracoLoader);
            loader.setKTX2Loader(ktx2Loader);
            loader.setMeshoptDecoder(MeshoptDecoder);

            loader.parse(contents, "", function (result) {
              const scene = result.scene;
              scene.name = filename;

              scene.animations.push(...result.animations);
              editor.execute(new AddObjectCommand(editor, scene));

              dracoLoader.dispose();
            });
          },
          false
        );
        reader.readAsArrayBuffer(file);

        break;
      }

      case "ifc": {
        reader.addEventListener(
          "load",
          async function (event) {
            const { IFCLoader } = await import(
              "three/addons/loaders/IFCLoader.js"
            );

            var loader = new IFCLoader();
            loader.ifcManager.setWasmPath("three/addons/loaders/ifc/");

            const model = await loader.parse(event.target.result);
            model.mesh.name = filename;

            editor.execute(new AddObjectCommand(editor, model.mesh));
          },
          false
        );
        reader.readAsArrayBuffer(file);

        break;
      }

      case "obj": {
        reader.addEventListener(
          "load",
          async function (event) {
            const contents = event.target.result;

            const { OBJLoader } = await import(
              "three/addons/loaders/OBJLoader.js"
            );

            const object = new OBJLoader().parse(contents);
            object.name = filename;

            editor.execute(new AddObjectCommand(editor, object));
          },
          false
        );
        reader.readAsText(file);

        break;
      }

      default:
        console.error("Unsupported file format (" + extension + ").");

        break;
    }
  };
}

export { Loader };
