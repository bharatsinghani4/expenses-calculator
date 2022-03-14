/******/ (function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Flag the module as loaded
    /******/ module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/ __webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/ __webpack_require__.c = installedModules;
  /******/
  /******/ // define getter function for harmony exports
  /******/ __webpack_require__.d = function (exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        /******/ configurable: false,
        /******/ enumerable: true,
        /******/ get: getter,
        /******/
      });
      /******/
    }
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/ __webpack_require__.n = function (module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default'];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, 'a', getter);
    /******/ return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/ __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/ __webpack_require__.p = '';
  /******/
  /******/ // Load entry module and return exports
  /******/ return __webpack_require__((__webpack_require__.s = 0));
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function (module, __webpack_exports__, __webpack_require__) {
      'use strict';
      Object.defineProperty(__webpack_exports__, '__esModule', { value: true });
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__time_js__ =
        __webpack_require__(1);

      // import THREE from 'three';

      let waveVertexShader = `
    uniform float size;
    uniform float frequency1;
    uniform float frequency2;
    uniform float offset1;
    uniform float offset2;
    uniform float waveHeight1;
    uniform float waveHeight2;


    void main() { 
        vec3 curPos;
        curPos = vec3(position.x, 1, position.z);
        curPos[1] = cos(position.x * frequency1 + offset1) * sin(position.z * frequency1 + offset1) * waveHeight1 + cos(position.x * frequency2 + offset2) * sin(position.z * frequency2 + offset2) * waveHeight2;


        gl_PointSize = size;//min(size * curPos[1] * 0.2, 4.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( curPos, 1.0 ); 
    }

`;

      let waveFragmentShader = `

    uniform sampler2D texture; 
    uniform vec3 color; 
    uniform float opacity; 
    void main() { 
        
        gl_FragColor = vec4(color, opacity) * texture2D( texture, gl_PointCoord ); 
        // gl_FragColor = vec4(1,1,1,1); 
    }

`;

      let pointImg = './point.png';
      let pointCvs = document.createElement('canvas');
      let pointCtx = pointCvs.getContext('2d');

      pointCvs.width = 32;
      pointCvs.height = 32;

      var grd = pointCtx.createRadialGradient(16, 16, 5, 16, 16, 16);
      grd.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      grd.addColorStop(1, 'rgba(255, 255, 255, 0)');

      pointCtx.fillStyle = grd;
      pointCtx.fillRect(0, 0, 32, 32);
      // document.body.appendChild(pointCvs);

      class Wave extends __WEBPACK_IMPORTED_MODULE_0__time_js__[
        'a' /* Time */
      ] {
        constructor(options) {
          super();

          let defaults = {
            color: '#ffffff',
            opacity: 1,
            position: new THREE.Vector3(),
            xCount: 100,
            zCount: 100,

            xDis: 200,
            zDis: 200,

            size: 1, // 点大小
            frequency1: 0.2,
            frequency2: 0.1,

            maxWaveHeight1: 10,
            minWaveHeight1: 3,
            maxWaveHeight2: 8,
            minWaveHeight2: 5,

            initOffset1: 0,
            initOffset2: 0,
            offsetSpeed1: 2,
            offsetSpeed2: 4,
            offsetSign: 1, // -1 or 1
          };

          for (let key in defaults) {
            options[key] = options[key] || defaults[key];
          }
          options.xStep = options.xDis / options.xCount;
          options.zStep = options.zDis / options.zCount;

          this.options = options;

          this.tick;

          this.offset1 = options.initOffset1;
          this.offset2 = options.initOffset2;

          this.particlePositions;
          this.obj = this.create();
        }

        create() {
          let options = this.options;

          let particlesGeom = new THREE.BufferGeometry();
          let particlePositions = new Float32Array(
            options.xCount * options.zCount * 3
          );

          let uniforms = {
            texture: {
              value: new THREE.CanvasTexture(pointCvs),
            },
            color: {
              value: new THREE.Color(options.color),
            },
            opacity: {
              type: 'float',
              value: options.opacity,
            },
            size: {
              type: 'float',
              value: options.size * 10,
            },
            frequency1: {
              type: 'float',
              value: options.frequency1,
            },
            frequency2: {
              type: 'float',
              value: options.frequency2,
            },
            offset1: {
              type: 'float',
              value: 0,
            },
            offset2: {
              type: 'float',
              value: 0,
            },
            waveHeight1: {
              type: 'float',
              value: 0,
            },
            waveHeight2: {
              type: 'float',
              value: 0,
            },
          };

          var shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: waveVertexShader,
            fragmentShader: waveFragmentShader,

            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
          });

          let count = 0;
          for (let x = 0; x < options.xCount; x++) {
            for (let z = 0; z < options.zCount; z++) {
              particlePositions[count++] = x * options.xStep;
              particlePositions[count++] = 0; // y
              particlePositions[count++] = z * options.zStep;
            }
          }

          this.particlePositions = particlePositions;

          particlesGeom.setDrawRange(0, options.xCount * options.zCount);
          particlesGeom.addAttribute(
            'position',
            new THREE.BufferAttribute(particlePositions, 3).setDynamic(true)
          );
          particlesGeom.computeBoundingBox();
          particlesGeom.center();

          let points = new THREE.Points(particlesGeom, shaderMaterial);
          points.position.copy(options.position);
          points.rotation.y = Math.random() * 0.2;

          return points;
        }

        start() {
          this.tick = this.addTick(this.update);

          let that = this;
          function changeWHP(waveHeight) {
            that.obj.material.uniforms.waveHeight1.value =
              waveHeight.waveHeight1;
            that.obj.material.uniforms.waveHeight2.value =
              waveHeight.waveHeight2;
            // console.log(this.waveHeight1);
          }

          let waveHeight = {
            waveHeight1: this.options.minWaveHeight1,
            waveHeight2: this.options.minWaveHeight2,
          };
          let tween1 = new TWEEN.Tween(waveHeight)
            .to(
              {
                waveHeight1: this.options.maxWaveHeight1,
                waveHeight2: this.options.maxWaveHeight2,
              },
              3000
            )
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(changeWHP);

          let tween2 = new TWEEN.Tween(waveHeight)
            .to(
              {
                waveHeight1: this.options.minWaveHeight1,
                waveHeight2: this.options.minWaveHeight2,
              },
              3000
            )
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(changeWHP);

          this.addTween(tween1);
          // this.addTween(tween2);
          tween1.chain(tween2);
          tween2.chain(tween1);
          tween1.start();
        }

        stop() {
          this.removeTick(this.tick);
        }

        update(delta) {
          let options = this.options;
          let second = delta / 1000;
          let particlePositions = this.particlePositions;

          this.obj.material.uniforms.offset1.value +=
            second * options.offsetSpeed1 * options.offsetSign;
          this.obj.material.uniforms.offset2.value +=
            second * options.offsetSpeed2 * options.offsetSign;
        }
      }

      class Ani extends __WEBPACK_IMPORTED_MODULE_0__time_js__['a' /* Time */] {
        constructor() {
          super();
          this.waves = [];
          this.tick;

          this.scene = new THREE.Scene(); //场景

          this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
          ); //透视相机
          this.camera.position.set(0, 6, 150); //相机位置
          this.scene.add(this.camera); //add到场景中
          // this.scene.fog = new THREE.Fog(0x000000, 100, 500);

          this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
          }); //渲染
          this.renderer.setClearColor(0x000000, 0);
          this.renderer.setSize(
            window.innerWidth,
            (window.innerWidth * 9) / 16
          );
          document.querySelector('body').appendChild(this.renderer.domElement); //将渲染Element添加到Dom中
        }

        resize() {
          // console.log(1);
          this.camera.aspect = 16 / 9;
          this.renderer.setSize(
            window.innerWidth,
            (window.innerWidth * 9) / 16
          );
        }

        addWave(wave) {
          this.waves.push(wave);
          this.scene.add(wave.obj);
        }

        start() {
          this.waves.forEach((w) => w.start());
          this.tick = this.addTick(this.update);
        }

        stop() {
          this.removeTick(this.tick);
        }

        update() {
          this.renderer.render(this.scene, this.camera);
        }
      }

      let wave1 = new Wave({
        color: 0x3062ff,
        opacity: 0.7,
        position: new THREE.Vector3(),
        xCount: 300,
        zCount: 300,
        xDis: 200, // x 宽
        zDis: 200, // z 宽
        size: 0.6, // 点大小
        frequency1: 0.03,
        frequency2: 0.06,

        maxWaveHeight1: 8,
        minWaveHeight1: 3,
        maxWaveHeight2: 6,
        minWaveHeight2: 3,

        initOffset1: 0,
        initOffset2: 0,
        offsetSpeed1: 0.6,
        offsetSpeed2: 0.4,
        offsetSign: 1, // -1 or 1
      });
      let wave2 = new Wave({
        color: 0x3bdee0,
        opacity: 0.2,
        position: new THREE.Vector3(0, 6, -50),
        xCount: 180,
        zCount: 180,
        xDis: 200, // x 宽
        zDis: 200, // z 宽
        size: 0.4, // 点大小
        frequency1: 0.06,
        frequency2: 0.052,

        maxWaveHeight1: 6,
        minWaveHeight1: 4,
        maxWaveHeight2: 4,
        minWaveHeight2: 2,

        initOffset1: 0,
        initOffset2: 0,
        offsetSpeed1: 0.3,
        offsetSpeed2: 0.1,
        offsetSign: -1, // -1 or 1
      });

      let ani = new Ani();
      ani.addWave(wave1);
      ani.addWave(wave2);

      ani.start();

      window.addEventListener('resize', () => {
        // console.log(1132);
        ani.resize();
      });

      window.TIME.start();

      /***/
    },
    /* 1 */
    /***/ function (module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* unused harmony export TIME */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function () {
          return Time;
        }
      );
      // import TWEEN from 'tween.js';

      /* 时间 */
      var TIME = {
        // 所有时间body对象
        bodys: [],
        delta: 16,
      };

      var stop = false;
      var t;
      TIME.addBody = function (timeBody) {
        this.bodys.push(timeBody);
      };

      TIME.removeBody = function (timeBody) {
        var index = this.bodys.indexOf(timeBody);

        if (index !== -1) {
          this.bodys.splice(index, 1);
        }
      };
      TIME.tick = (function () {
        var now = new Date().getTime();
        var last = now;
        var delta;
        return function () {
          delta = now - last;
          delta = delta > 500 ? 30 : delta < 16 ? 16 : delta;
          TIME.delta = delta;
          last = now;

          TIME.handleFrame(delta);
          if (!stop) {
            t = requestAnimationFrame(TIME.tick);
            // setTimeout(TIME.tick, 1000);
          }
        };
      })();

      TIME.start = function () {
        stop = false;
        cancelAnimationFrame(t);
        this.tick();
      };

      TIME.stop = function () {
        cancelAnimationFrame(t);
        stop = true;
      };

      TIME.handleFrame = function (delta) {
        TIME.bodys.forEach(function (body) {
          if (!body.isStop) {
            body.ticks.forEach(function (tick) {
              tick.fn && tick.fn(delta);
            });
          }
        });

        TWEEN.update();
      };

      window.TIME = TIME;

      /* 时间物体类，提供两个时机，帧更新，固定间隔更新，每一个有时间概念的物体，就继承 */
      class Time {
        constructor() {
          this.ticks = [];
          this.tweens = [];
          this.isStop = false;
          TIME.addBody(this);
        }

        /**
         * 该物体灭亡
         */
        destory() {
          TIME.removeBody(this);
        }

        /**
         * 帧更新
         * @param timegap 与上一帧的时间间隔
         */
        addTick(fn) {
          var tick = { fn: fn.bind(this) };

          tick.isStop = false;
          this.ticks.push(tick);
          return tick;
        }

        removeTick(tick) {
          if (!tick) {
            // remove all
            this.ticks = [];
            return;
          }

          var index = this.ticks.indexOf(tick);

          if (index !== -1) {
            this.ticks.splice(index, 1);
          }
        }

        /**
         * tween
         */
        addTween(tween) {
          this.tweens.push(tween);
        }

        removeTween(tween) {
          if (!tween) {
            // remove all
            this.tween = [];
            return;
          }

          var index = this.tweens.indexOf(tween);

          if (index !== -1) {
            //tween.stop();
            this.tweens.splice(index, 1);
          }
        }

        // stop 暂停时间
        stop() {
          this.isStop = true;
          this.tweens.forEach(function (tween) {
            tween.stop();
          });
        }

        start() {
          this.isStop = false;
          this.tweens.forEach(function (tween) {
            tween.start();
          });
        }
      }

      window.Time = Time;

      for (let i = 0; i < 10000; i += 100) {
        window['TIME_' + i] = window.env === 'develop' ? 0 : i;
      }

      /***/
    },
    /******/
  ]
);
