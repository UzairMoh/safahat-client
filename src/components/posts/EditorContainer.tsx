import { motion } from 'framer-motion';
import { Controller } from 'react-hook-form';
import PostTitleInput from './PostTitleInput';
import TextEditor from './TextEditor';

interface EditorContainerProps {
    control: any;
    errors: any;
    isSettingsPanelOpen: boolean;
}

const EditorContainer = ({ control, errors, isSettingsPanelOpen }: EditorContainerProps) => {
    return (
        <motion.div
            animate={{
                width: isSettingsPanelOpen ? 'calc(100% - 320px)' : '100%',
                marginRight: isSettingsPanelOpen ? '0' : '0'
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen overflow-auto bg-white"
        >
            <div className="max-w-4xl mx-auto p-8 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <PostTitleInput control={control} errors={errors} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                >
                    <Controller
                        name="content"
                        control={control}
                        rules={{ required: 'Content is required' }}
                        render={({ field }) => (
                            <TextEditor
                                value={field.value || ''}
                                onChange={field.onChange}
                                error={errors.content?.message as string}
                                fullPage={true}
                            />
                        )}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EditorContainer;