import { motion } from 'framer-motion';
import { PostResponse } from '../../api/Client';

interface PostContentProps {
    post: PostResponse;
}

const PostContent = ({ post }: PostContentProps) => {
    const markdownToHtml = (text: string): string => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#4a5b91] font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="text-[#938384] italic">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-[#f4e1c3] text-[#4a5b91] px-2 py-1 rounded text-sm font-mono">$1</code>')
            .replace(/^\> (.+)/gm, '<blockquote class="border-l-4 border-[#e7b9ac] pl-6 italic text-[#938384] my-6 bg-[#f6f8fd] py-4 rounded-r-lg">$1</blockquote>')
            .replace(/^\- (.+)/gm, '<li class="ml-4 text-[#4a5b91] my-2">$1</li>')
            .replace(/^(\d+)\. (.+)/gm, '<li class="ml-4 text-[#4a5b91] my-2">$2</li>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#4a5b91] underline hover:text-[#3a4a7a] transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/\n\n/g, '</p><p class="mb-6 text-[#4a5b91] leading-relaxed">')
            .replace(/\n/g, '<br>')
            .replace(/(<li>.*<\/li>)/g, '<ul class="list-disc list-outside my-6 space-y-2 pl-6">$1</ul>')
            .replace(/<\/ul>\s*<ul class="list-disc list-outside my-6 space-y-2 pl-6">/g, '');
    };

    const processedContent = post.content
        ? `<p class="mb-6 text-[#4a5b91] leading-relaxed">${markdownToHtml(post.content)}</p>`
        : '<p class="text-[#938384] italic">No content available.</p>';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="px-8 py-8"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white border-2 border-[#c9d5ef]/30 rounded-2xl p-8 shadow-sm"
            >
                <div
                    className="prose prose-lg max-w-none"
                    style={{
                        fontSize: '1.125rem',
                        lineHeight: '1.75',
                        color: '#4a5b91'
                    }}
                    dangerouslySetInnerHTML={{
                        __html: processedContent
                    }}
                />

                {/* Reading time estimation */}
                {post.content && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 pt-6 border-t border-[#c9d5ef]/30 flex justify-between items-center text-sm text-[#938384]"
                    >
                        <span>
                            {Math.ceil(post.content.split(' ').length / 200)} min read
                        </span>
                        <span>
                            {post.content.split(' ').length} words
                        </span>
                    </motion.div>
                )}
            </motion.div>

            {/* Author Bio Section */}
            {post.author?.bio && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-8 bg-[#f6f8fd]/50 border border-[#c9d5ef]/30 rounded-2xl p-6"
                >
                    <div className="flex items-start space-x-4">
                        {post.author.profilePictureUrl ? (
                            <img
                                src={post.author.profilePictureUrl}
                                alt={post.author.fullName || post.author.username}
                                className="w-16 h-16 rounded-full object-cover border-2 border-[#c9d5ef]"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-[#4a5b91] flex items-center justify-center text-white text-xl font-semibold">
                                {(post.author.fullName || post.author.username || 'U').charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#4a5b91] mb-2">
                                About {post.author.fullName || post.author.username}
                            </h3>
                            <p className="text-[#938384] leading-relaxed">
                                {post.author.bio}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default PostContent;