import { HTMLMotionProps, motion } from 'framer-motion';
import { transitions } from '@civichub/animations';

export const MotionPage = (props: HTMLMotionProps<'div'>) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={transitions.page}
    {...props}
  />
);

export const MotionList = {
  container: (props: HTMLMotionProps<'div'>) => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
        hidden: {},
      }}
      {...props}
    />
  ),
  item: (props: HTMLMotionProps<'div'>) => (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={transitions.page}
      {...props}
    />
  ),
};

export const MotionHover = (props: HTMLMotionProps<'div'>) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={transitions.hover}
    {...props}
  />
);

export const MotionPress = (props: HTMLMotionProps<'button'>) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    transition={transitions.press}
    {...props}
  />
);

export const MotionDialog = (props: HTMLMotionProps<'div'>) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={transitions.dialog}
    {...props}
  />
);

export const MotionToast = (props: HTMLMotionProps<'div'>) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
    transition={transitions.dialog}
    {...props}
  />
);

export const MotionShared = {
  layoutId: (id: string, props: HTMLMotionProps<'div'>) => (
    <motion.div layoutId={id} transition={transitions.page} {...props} />
  )
};
