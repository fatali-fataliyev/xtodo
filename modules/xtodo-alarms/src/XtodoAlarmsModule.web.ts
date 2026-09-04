import { registerWebModule, NativeModule } from 'expo';

class XtodoAlarmsModule extends NativeModule<{}> {}

export default registerWebModule(XtodoAlarmsModule, 'XtodoAlarmsModule');
