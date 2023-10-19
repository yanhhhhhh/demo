import {
	BoxGeometry,
	CanvasTexture,
	Color,
	Mesh,
	MeshBasicMaterial,
	Object3D,
	OrthographicCamera,
	Raycaster,
	Sprite,
	SpriteMaterial,
	Vector2,
	Vector3,
	Vector4,
	PerspectiveCamera,
	Object3DEventMap
} from 'three';
import { CameraControls } from "..";

class ViewHelper extends Object3D {
	isViewHelper: boolean;
	animating: boolean;
	center: Vector3;
	render: (renderer: any) => void;
	handleClick: (event: any) => boolean;
	dispose: () => void;
	doAnimation: (object: Object3D, center: any) => void;

	constructor(
		camera: PerspectiveCamera | OrthographicCamera,
		domElement: HTMLElement,
		cameraControls: CameraControls
	) {

		super();

		this.isViewHelper = true;

		this.animating = false;
		this.center = new Vector3();

		const color1 = new Color( '#ff3653' );
		const color2 = new Color( '#8adb00' );
		const color3 = new Color( '#2c8fff' );

		const interactiveObjects: Object3D<Object3DEventMap>[] = [];
		const raycaster = new Raycaster();
		const mouse = new Vector2();

		const orthoCamera = new OrthographicCamera( - 2, 2, 2, - 2, 0, 4 );
		orthoCamera.position.set( 0, 0, 2 );

		// x、y、z 3条轴
		const geometry = new BoxGeometry( 0.8, 0.05, 0.05 ).translate( 0.4, 0, 0 );

		const xAxis = new Mesh( geometry, getAxisMaterial( color1 ) );
		const yAxis = new Mesh( geometry, getAxisMaterial( color2 ) );
		const zAxis = new Mesh( geometry, getAxisMaterial( color3 ) );

		yAxis.rotation.z = Math.PI / 2;
		zAxis.rotation.y = - Math.PI / 2;

		this.add( xAxis );
		this.add( zAxis );
		this.add( yAxis );

		// 6个圆点：posXAxisHelper为有轴的圆点，negXAxisHelper为反方向、没有轴、相对小为0.8且目前透明度为0.5的圆点
		const posXAxisHelper = new Sprite( getSpriteMaterial( color1, 'X' ) );
		posXAxisHelper.userData.type = 'posX';
		const posYAxisHelper = new Sprite( getSpriteMaterial( color2, 'Y' ) );
		posYAxisHelper.userData.type = 'posY';
		const posZAxisHelper = new Sprite( getSpriteMaterial( color3, 'Z' ) );
		posZAxisHelper.userData.type = 'posZ';
		const negXAxisHelper = new Sprite( getSpriteMaterial( color1 ) );
		negXAxisHelper.userData.type = 'negX';
		const negYAxisHelper = new Sprite( getSpriteMaterial( color2 ) );
		negYAxisHelper.userData.type = 'negY';
		const negZAxisHelper = new Sprite( getSpriteMaterial( color3 ) );
		negZAxisHelper.userData.type = 'negZ';

		posXAxisHelper.position.x = 1;
		posYAxisHelper.position.y = 1;
		posZAxisHelper.position.z = 1;
		negXAxisHelper.position.x = - 1;
		negXAxisHelper.scale.setScalar( 0.8 );
		negYAxisHelper.position.y = - 1;
		negYAxisHelper.scale.setScalar( 0.8 );
		negZAxisHelper.position.z = - 1;
		negZAxisHelper.scale.setScalar( 0.8 );

		this.add( posXAxisHelper );
		this.add( posYAxisHelper );
		this.add( posZAxisHelper );
		this.add( negXAxisHelper );
		this.add( negYAxisHelper );
		this.add( negZAxisHelper );

		interactiveObjects.push( posXAxisHelper );
		interactiveObjects.push( posYAxisHelper );
		interactiveObjects.push( posZAxisHelper );
		interactiveObjects.push( negXAxisHelper );
		interactiveObjects.push( negYAxisHelper );
		interactiveObjects.push( negZAxisHelper );

		const point = new Vector3();
		const dim = 128; // 视角指示图的宽高

		this.render = function ( renderer ) {

			// quaternion表示对象局部旋转的Quaternion（四元数），此处用来获取相机的旋转信息
			// quaternion.invert()，翻转该四元数 —— 计算 conjugate 。假定该四元数具有单位长度。
			// quaternion.conjugate()返回该四元数的旋转共轭。 四元数的共轭表示的是，围绕旋转轴在相反方向上的相同旋转。
			this.quaternion.copy( camera.quaternion ).invert(); 
			this.updateMatrixWorld(); // 更新子对象的matrixWorld

			point.set( 0, 0, 1 );  // ？？？？？ todo  示意图的位置？？好像改了无效   /// 默认 0000
			point.applyQuaternion( camera.quaternion ); // 应用四元数

			// 旋转过程中，<0的透明度设为0.5
			if ( point.x >= 0 ) {

				posXAxisHelper.material.opacity = 1;
				negXAxisHelper.material.opacity = 0.5;

			} else {

				posXAxisHelper.material.opacity = 0.5;
				negXAxisHelper.material.opacity = 1;

			}

			if ( point.y >= 0 ) {

				posYAxisHelper.material.opacity = 1;
				negYAxisHelper.material.opacity = 0.5;

			} else {

				posYAxisHelper.material.opacity = 0.5;
				negYAxisHelper.material.opacity = 1;

			}

			if ( point.z >= 0 ) {

				posZAxisHelper.material.opacity = 1;
				negZAxisHelper.material.opacity = 0.5;

			} else {

				posZAxisHelper.material.opacity = 0.5;
				negZAxisHelper.material.opacity = 1;

			}

			// canvas绘制rect 相关api
			const x = domElement.offsetWidth - dim;

			renderer.clearDepth();

			renderer.getViewport( viewport );
			renderer.setViewport( x, 0, dim, dim );

			renderer.render( this, orthoCamera );

			renderer.setViewport( viewport.x, viewport.y, viewport.z, viewport.w );

		};

		const viewport = new Vector4();

		this.handleClick = function ( event ) {

			const rect = domElement.getBoundingClientRect();
			const offsetX = rect.left + ( domElement.offsetWidth - dim );
			const offsetY = rect.top + ( domElement.offsetHeight - dim );
			mouse.x = ( ( event.clientX - offsetX ) / ( rect.right - offsetX ) ) * 2 - 1;
			mouse.y = - ( ( event.clientY - offsetY ) / ( rect.bottom - offsetY ) ) * 2 + 1;

			raycaster.setFromCamera( mouse, orthoCamera );

			const intersects = raycaster.intersectObjects( interactiveObjects );

			if ( intersects.length > 0 ) {

				const intersection = intersects[ 0 ];
				const object = intersection.object;

				this.doAnimation(object, this.center);

				this.animating = true;

				return true;

			} else {

				return false;

			}

		};

		this.doAnimation = function (object: Object3D,) {
			
			const posType = object.userData.type;
			switch (posType) {

				case 'posX':
					cameraControls.rotateTo(Math.PI * 0.5, Math.PI * 0.5, true);
					break;

				case 'posY':// 
					cameraControls.rotateTo(0, -Math.PI, true);
					break;

				case 'posZ':
					cameraControls.rotateTo(0, Math.PI * 0.5, true);
					break;

				case 'negX':
					cameraControls.rotateTo(-Math.PI * 0.5, Math.PI * 0.5, true);
					break;

				case 'negY':
					cameraControls.rotateTo(0, Math.PI,  true);
					break;

				case 'negZ':
					cameraControls.rotateTo(Math.PI, Math.PI * 0.5, true);
					break;

				default:
					console.error( 'ViewHelper: Invalid axis.' );

			}
		}

		this.dispose = function () {

			geometry.dispose();

			xAxis.material.dispose();
			yAxis.material.dispose();
			zAxis.material.dispose();

			posXAxisHelper.material.map?.dispose();
			posYAxisHelper.material.map?.dispose();
			posZAxisHelper.material.map?.dispose();
			negXAxisHelper.material.map?.dispose();
			negYAxisHelper.material.map?.dispose();
			negZAxisHelper.material.map?.dispose();

			posXAxisHelper.material.dispose();
			posYAxisHelper.material.dispose();
			posZAxisHelper.material.dispose();
			negXAxisHelper.material.dispose();
			negYAxisHelper.material.dispose();
			negZAxisHelper.material.dispose();

		};

		function getAxisMaterial( color: Color ) {

			return new MeshBasicMaterial( { color: color, toneMapped: false } );

		}

		function getSpriteMaterial( color: Color, text: string | null = null ) {

			const canvas: HTMLCanvasElement = document.createElement( 'canvas' );
			canvas.width = 64;
			canvas.height = 64;

			const context = canvas.getContext( '2d' ) as CanvasRenderingContext2D;
			context.beginPath();
			context.arc( 32, 32, 16, 0, 2 * Math.PI );
			context.closePath();
			context.fillStyle = color.getStyle();
			context.fill();

			if ( text !== null ) {

				context.font = '24px Arial';
				context.textAlign = 'center';
				context.fillStyle = '#000000';
				context.fillText( text, 32, 41 );

			}

			const texture = new CanvasTexture( canvas );

			return new SpriteMaterial( { map: texture, toneMapped: false } );

		}

	}

}

export { ViewHelper };
