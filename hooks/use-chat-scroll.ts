import { useEffect, useState } from 'react';

interface ChatScrollProps {
    chatRef: React.RefObject<HTMLDivElement | null>;
    bottomRef: React.RefObject<HTMLDivElement | null>;
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;
}

export const useChatScroll = ({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count,
}: ChatScrollProps) => {
    const [hasInitialScroll, setHasInitialScroll] = useState(false);
    const topDiv = chatRef?.current;
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop;
            if (scrollTop === 0 && shouldLoadMore) {
                loadMore();
            }
        };
        topDiv?.addEventListener('scroll', handleScroll);
        return () => {
            topDiv?.removeEventListener('scroll', handleScroll);
        };
    }, [shouldLoadMore, loadMore, chatRef]);

    useEffect(() => {
        const bottomDiv = bottomRef?.current;
        const topDiv = chatRef?.current;
        const shouldAutoScroll = () => {
            if (!hasInitialScroll && bottomDiv) {
                setHasInitialScroll(true);
                return true;
            }
            if (!topDiv) {
                return false;
            }
            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            return distanceFromBottom <= 100;
        };
        if (shouldAutoScroll()) {
            const timeout = setTimeout(() => {
                bottomDiv?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [bottomRef, chatRef, count, hasInitialScroll]);
};
