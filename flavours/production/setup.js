import shell from "shelljs";
import fs from "fs";

const FLAVOUR = 'production';

const pjson = JSON.parse(fs.readFileSync('./package.json'));
let versionDoc = {
    date: new Date().toISOString(),
    id: pjson.name,
    name: 'FieldForce',
    version: pjson.version + `-${FLAVOUR}`,
}
fs.writeFileSync('./static/version.json', JSON.stringify(versionDoc, null, 2));

// shell.cp(`./flavours/${FLAVOUR}/.env`, `./functions/.env`);
shell.cp(`./flavours/${FLAVOUR}/.env`, `./.env.development`);
shell.cp(`./flavours/${FLAVOUR}/.env`, './.env.production');
shell.cp(`./flavours/${FLAVOUR}/.firebaserc`, './.firebaserc');
shell.cp(`./flavours/${FLAVOUR}/firebase.json`, './firebase.json');

