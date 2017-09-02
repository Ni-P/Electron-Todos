const electron = require('electron');

var { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => {
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('todo:add', (event, todo) => {
  // console.log(todo);
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add new Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('close', () => (addWindow = null));
}

function clearTodos() {
  mainWindow.webContents.send('todo:clear');
}

const menuTemplate = [
  {
    label: 'File',

    submenu: [
      {
        label: 'New Todo',
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Clear Todos',
        click() {
          clearTodos();
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  //'production'
  //'development'
  //'staging'
  //'test'
  menuTemplate.push({
    label: 'View',
    submenu: [
      {
        role: 'reload'
      },
      {
        label: 'Toggle Developer Tools',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
        accelerator: 'F12'
      }
    ]
  });
}
