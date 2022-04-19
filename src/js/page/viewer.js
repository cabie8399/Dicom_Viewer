import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import Hammer from 'hammerjs';
import dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

const rootEl = document.querySelector('.root');
rootEl.innerHTML = String.raw`
    <div class="header">
        <div class="logo">
            <a href="/">
                <img src="img/logo.svg" alt="">  
            </a>
            <div class="logo-name">DICOM VIEWER</div>
        </div>
        
        <div class="user">
            <img  class="logo" src="img/user.svg" alt="">
        </div>
    </div>
    <div class="viewer">
        <div class="tool-bar">
            <div class="tool length">length</div>
            <div class="tool wwwc">wwwc</div>
            <div class="tool reset">reset</div>
            <!-- <div class="tool rotate">rotate</div> -->
            <br><br><br><br>
            <input type="range" class="slice-range" min="0" step="1" max="3">
        </div>
        <div class="cornerstone-element">
            <div class="dicom-info">
                <div class="sliceText">Image: </div>
            </div>
        </div>
    </div>
`;

const el = document.querySelector('.cornerstone-element');
cornerstone.enable(el);

class Dicom {
    constructor() {

    }

    static async displayDicom() {
        const urlList = [
            '/dicom/study1/1/1.dcm',
            '/dicom/study1/1/2.dcm',
            '/dicom/study1/1/3.dcm',
            '/dicom/study1/1/2.dcm',
        ];
    
        const imageIds = urlList.map((url) => `wadouri:${url}`);

        cornerstoneTools.addStackStateManager(el, ['stack', 'preload']);
        cornerstoneTools.addToolState(el, 'stack', {
            currentImageIdIndex: 0,
            imageIds,
        });
        const defaultImage = await cornerstone.loadAndCacheImage(imageIds[0]);
        cornerstone.displayImage(el, defaultImage);
        cornerstone.resize(el);
        this.dicomInfo();
    }

    static dicomInfo() {
        el.addEventListener('cornerstoneimagerendered', () => {
            const {
                currentImageIdIndex,
                imageIds,
            } = cornerstoneTools.getToolState(el, 'stack').data[0];
            const imageNumber = currentImageIdIndex + 1;
            const imageCount = imageIds.length;

            const currentValueSpan = document.querySelector('.sliceText');
            currentValueSpan.textContent = "Image : " + imageNumber + " / " + imageCount;

            // Update the slider value
            const slider = document.querySelector('.slice-range');
            slider.value = currentImageIdIndex;
        })
    }
}

class Tool {
    constructor() {

    }

    static addTool() {
        const toolOption = {
            showSVGCursors: true,
        };
        // cornerstoneTools.init(toolOption);
        cornerstoneTools.init();

        const cornerstoneOption = {
            renderer: 'webgl',
            desynchronized: true,
            preserveDrawingBuffer: true,
        };
        cornerstone.enable(el, cornerstoneOption);
        cornerstoneWADOImageLoader.webWorkerManager.initialize({
            taskConfiguration: {
                decodeTask: {

                },
            },
            webWorkerTaskPaths: [
                'https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader/dist/610.bundle.min.worker.js',
            ],
        });

        cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool, {});

        cornerstoneTools.setToolActive('StackScrollMouseWheel', {});
        cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
        cornerstoneTools.addTool(cornerstoneTools.LengthTool);
        // cornerstoneTools.addTool(cornerstoneTools.RotateTouchTool);
    };

    static bindToolBtn() {
        const lengthBtn = document.querySelector('.tool.length');
        const resetBtn = document.querySelector('.tool.reset');
        const wwwcBtn = document.querySelector('.tool.wwwc');
        const rotateButton = document.querySelector('.tool.rotate');

        lengthBtn.addEventListener('click', () => {
            cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });
        });
        wwwcBtn.addEventListener('click', () => {
            cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
        });
        resetBtn.addEventListener('click', () => {
            cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
            cornerstoneTools.globalImageIdSpecificToolStateManager.clear(el);
            cornerstone.reset(el);
        });
        // rotateButton.addEventListener('click', () => {
        //     cornerstoneTools.setToolActive('RotateTouch', { mouseButtonMask: 1 });
        // });
    };

    static slideBar() {
        const selectImage = async (event) => {
            const stackToolDataSource = cornerstoneTools.getToolState(el, 'stack');
            if (stackToolDataSource === undefined) {
                return;
            }
            const stackData = stackToolDataSource.data[0];
            let range;
            range = document.querySelector('.slice-range');
            range.min = 0;
            range.step = 1;
            range.max = stackData.imageIds.length - 1;

            const newImageIdIndex = parseInt(event.currentTarget.value, 10);
            if(newImageIdIndex !== stackData.currentImageIdIndex && stackData.imageIds[newImageIdIndex] !== undefined) {
                const defaultImage = await cornerstone.loadAndCacheImage(stackData.imageIds[newImageIdIndex]);
                const viewport = cornerstone.getViewport(el);
                stackData.currentImageIdIndex = newImageIdIndex;
                cornerstone.displayImage(el, defaultImage, viewport);
            };
        };
        document.querySelector('.slice-range').addEventListener("input", selectImage);
    }

    static init() {
        this.addTool();
        this.bindToolBtn();
        this.slideBar();
    };
}



// 初始化
export default function viewerInit() {
    Tool.init();
    Dicom.displayDicom();
} 
