import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { DocumentRegistry} from '@jupyterlab/docregistry';

import {NotebookPanel,INotebookModel} from "@jupyterlab/notebook";
import { IDisposable, DisposableDelegate } from '@phosphor/disposable';
import { ToolbarButton } from '@jupyterlab/apputils';
import { ISettingRegistry ,IStateDB} from '@jupyterlab/coreutils';

import {KernelManager,Kernel, NbConvertManager} from '@jupyterlab/services';
// import { toArray } from '@phosphor/algorithm';
// import { Application } from '@phosphor/application';
// import {HTMLViewer} from '@jupyterlab/htmlviewer'
// import {DocumentManager} from '@jupyterlab/docmanager'
/**
 * Initialization data for the jupyter-lab-servlerless extension.
 */
// const extension: JupyterFrontEndPlugin<void> = {
//   id: 'jupyter-lab-servlerless',
//   autoStart: true,
//   activate: 
// };
const printHtmlPlugin: JupyterFrontEndPlugin<void> = {
  id:'jupyter-lab-servlerless',
  requires: [
    ISettingRegistry,
    IStateDB
  ],
  activate,
  autoStart:true
}


// export function printHtml(settings: ISettingRegistry.ISettings):void{
//   console.log(settings)
//   const name = settings.get("name");
//   console.log("test_name:"+name);
// }

export function printHtml():void{
  // console.log(setting)
  // const onSettingsUpdated = async (settings: ISettingRegistry.ISettings) => {
  //   const baseUrl = settings.get('name').composite as
  //     | string
  //     | null
  //     | undefined;
  //   console.log(baseUrl)
  // }
  // console.log(onSettingsUpdated)
  // onSettingsUpdated
  // const name = settings.get("name");
  // console.log("test_name:"+name);
  // Notebook.defaultNotebookConfig.
}

export class ButtonExtensionPrintHtml implements DocumentRegistry.IWidgetExtension<NotebookPanel,INotebookModel> {
  
  // public readonly settings:ISettingRegistry.ISettings;

  // constructor(settings:ISettingRegistry.ISettings){
  //   this.settings = settings;
  // }

  public app:JupyterFrontEnd;
  public state:IStateDB;
  

  constructor(app:JupyterFrontEnd,state:IStateDB){
    this.app = app;
    this.state = state;
  }
  

  createNew(panel:NotebookPanel,context:DocumentRegistry.IContext<INotebookModel>):IDisposable {

    const commands = this.app.commands;

    let callback =() => {
      
      //1.获取配置
      // const name = getStateDbByKey(this.state,'name')
      this.state.toJSON().then((dict)=>{
        console.log(dict);
        const localPath = context.localPath;
        const filePath = dict['baseDir']+localPath;
        const newHtml = localPath.replace('.ipynb','.html')
        const defaultKenel = context.session.kernel;
        const code = "import os;os.system(\"jupyter nbconvert "+dict['nbconvertOptions']+" "+filePath+" \")"
        console.log(code);
        
        
        // defaultKenel.requestExecute({"code":code}).onReply = (s) =>{
        //   console.log(s)
        //   console.log('finish')
        //   commands.execute("docmanager:open",{path:newHtml})
        // }
        //同步执行代码 
        Promise.all([defaultKenel.requestExecute({"code":code}).done]).then(()=>{
          console.log('finish')
          commands.execute("docmanager:open",{path:newHtml})
        })
        // defaultKenel.requestExecute({"code":code}).done.then(()=>{
          
        // });
      })

      

      // defaultKenel.requestExecute({"code":code}).done.then(function(result){
      //   console.info(result);
      //   console.info('转换完成')
        // const ifra = new IFrame();
        // ifra.title.label = 'test'
        // console.log(ifra)
        // const main = new MainAreaWidget({content:ifra})
        // main.title.closable != !toArray(shell.widgets('main')).length
        // shell.add(main,"right",{activate:true})
        // console.log(main)
        // this.app.
        // this.app.shell.addT

      //   
      // })
    }

    

    let button = new ToolbarButton({
      className:'servlerless-add',
      iconClassName:'fa fa-print',
      // onClick: () =>printHtml(),
      onClick: callback,
      tooltip:'Save as Serverless Functions'
    });

    // panel.toolbar.addItem('servlerless-add',button);

    //设置位置
    panel.toolbar.insertAfter('cellType','servlerless-add',button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

function saveStateDb(state:IStateDB,key:string,value:string){
  state.save(key,value).then((restored)=>{
    console.log('保存成功')
  })
}


function activate(app: JupyterFrontEnd,settingRegistry:ISettingRegistry,state:IStateDB) {
  console.log('-----------')
  console.log(Kernel)
  console.log(KernelManager);
  console.log(NbConvertManager);
  console.log('-------------')
  console.log(app);
  // const { restored} = app;

  let name = '';
  let baseDir = '';
  let nbconvertOptions = '';
  console.log(state)
  /**
   * 
   */
  async function updateSettings(
    settings:ISettingRegistry.ISettings
  ):Promise<void> {
    name = settings.get('name').composite as string | null;
    baseDir = settings.get('baseDir').composite as string | null;
    nbconvertOptions = settings.get('nbconvertOptions').composite as string | null;
    saveStateDb(state,"name",name);
    saveStateDb(state,"baseDir",baseDir);
    saveStateDb(state,"nbconvertOptions",nbconvertOptions)
    // console.log('updateSettings:'+name)
    // // saveStateDb(state,'name',name);
    // state.save('name',name).then((a)=>{
    //   console.log('保存成功')
    // })
  }
  



  Promise.all([settingRegistry.load('jupyter-lab-servlerless:plugin')])
    .then(async ([settings]) => {
      await updateSettings(settings);
      // console.log(name);
      settings.changed.connect(async () => {
        await updateSettings(settings);
        // console.log(name);
      })
    })
    .catch((reason:Error) => {
      console.error(reason.message);
    })

  // shell.widgets('mian')
  // console.log(TerminalSession.startNe)
  // console.info(settings)
  app.serviceManager.nbconvert.getExportFormats();
  app.docRegistry.addWidgetExtension('Notebook',new ButtonExtensionPrintHtml(app,state));
  // app.docRegistry.addWidgetExtension('Notebook',new ButtonExtensionPrintHtml());
  void settingRegistry.load('jupyter-lab-servlerless:plugin')
}

// export default extension;
export default printHtmlPlugin;
