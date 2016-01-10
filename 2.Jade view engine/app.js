var fs = require('fs'),
    jade = require('jade'),
    path = require('path'),
    templatesDir = 'templates',
    outputHTMLDir = 'renderedHTML',
    templateModels = {
        'nav': [
            {title: 'Home', url: 'index'},
            {title: 'Smart phones', url: 'smartPhones'},
            {title: 'Tablets', url: 'tablets'},
            {title: 'Wearables', url: 'wearables'}
        ],
        'index': {greeting: 'Hello', siteInfo: 'Buy phone and get it done.'},
        'smartPhones': [
            {name: "iPhone", specs: 'core: X, RAM: X...'},
            {name: "Samsung", specs: 'core: X, RAM: X...'},
            {name: "HTC", specs: 'core: X, RAM: X...'},
            {name: "Nexus", specs: 'core: X, RAM: X...'},
            {name: "Windows phone", specs: 'core: X, RAM: X...'}
        ],
        'tablets': [
            {name: "iPad", specs: 'core: X, RAM: X...'},
            {name: "Samsung", specs: 'core: X, RAM: X...'},
            {name: "Andoird", specs: 'core: X, RAM: X...'}
        ],
        'wearables': [
            {name: "1", desc: 'x....'},
            {name: "2", desc: 'w...'},
            {name: "3", desc: 'f....'}
        ]
    };

if (!fs.existsSync(templatesDir)) {
    console.error('The directory %s does not exists.', templatesDir);
    return;
}

if (!fs.existsSync(outputHTMLDir)) {
    fs.mkdirSync(outputHTMLDir);
}

fs.readdir(templatesDir, function (error, files) {
    var i = 0,
        length,
        currentJadeFileName;

    var jadeFileNames = getFilesWithSpecificExtension(files, 'jade');
    length = jadeFileNames.length;
    if (length == 0) {
        console.error('No jade templates to process.');
        return;
    }

    for(i; i < length; i++) {
        currentJadeFileName = jadeFileNames[i];
        renderHTML(currentJadeFileName);
    }
});

function renderHTML(currentJadeFileName) {
    var currentFileName,
        currentRelativePathToJadeFile,
        currentRelativePathToHTMLOutputFile,
        template,
        model,
        renderedHTML;

    currentRelativePathToJadeFile = templatesDir + '/' + currentJadeFileName;
    fs.readFile(currentRelativePathToJadeFile, 'UTF8', function (error, templateJade) {
        currentFileName = currentJadeFileName.slice(0, -5);

        template = jade.compile(templateJade, {
            filename: path.join(__dirname, templatesDir + '/baseLayout.jade'),
            pretty: true
        });
        model = {
            navs: templateModels.nav,
            page: templateModels[currentFileName]
        };
        renderedHTML = template(model);

        currentRelativePathToHTMLOutputFile = outputHTMLDir + '/' + currentFileName + '.html';
        fs.writeFile(currentRelativePathToHTMLOutputFile, renderedHTML, 'UTF8', function (error) {
            console.log('%s template rendered successfully to %s directory.', currentJadeFileName, outputHTMLDir);
        })
    })
}

function getFilesWithSpecificExtension(fileNames, extenstion) {
    extenstion = '.' + extenstion;

    var i = 0,
        length = fileNames.length,
        fileName,
        currentFileExtension,
        jadeFileNames = [];

    for (i; i < length; i++) {
        fileName = fileNames[i];
        currentFileExtension = path.extname(fileName);

        if (currentFileExtension == extenstion) {
            jadeFileNames.push(fileName);
        }
    }

    return jadeFileNames;
}