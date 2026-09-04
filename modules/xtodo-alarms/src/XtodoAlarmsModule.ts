import { NativeModule, requireNativeModule } from 'expo';

declare class XtodoAlarmsModule extends NativeModule<{}> {}

export default requireNativeModule<XtodoAlarmsModule>('XtodoAlarms');
