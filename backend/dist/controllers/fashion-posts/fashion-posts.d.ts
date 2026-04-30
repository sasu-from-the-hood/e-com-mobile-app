import { z } from 'zod';
/**
 * Create or update a fashion post
 */
export declare const createPost: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    caption: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isDraft: z.ZodDefault<z.ZodBoolean>;
    sceneMode: z.ZodDefault<z.ZodEnum<{
        "3d": "3d";
        "2d": "2d";
    }>>;
    backgroundColor: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
        floor: "floor";
        studio: "studio";
        outdoor: "outdoor";
        minimal: "minimal";
    }>>>;
    items: z.ZodDefault<z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        modelId: z.ZodString;
        leftLegFile: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        boneName: z.ZodString;
        bodyPartType: z.ZodString;
        scale: z.ZodNumber;
        positionX: z.ZodNumber;
        positionY: z.ZodNumber;
        positionZ: z.ZodNumber;
    }, z.core.$strip>>>;
    textElements: z.ZodDefault<z.ZodArray<z.ZodObject<{
        content: z.ZodString;
        positionX: z.ZodNumber;
        positionY: z.ZodNumber;
        fontSize: z.ZodNumber;
        fontFamily: z.ZodString;
        color: z.ZodString;
        rotation: z.ZodNumber;
        zIndex: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    postId: string;
    isUpdate: boolean;
}, {
    postId: string;
    isUpdate: boolean;
}>, Record<never, never>, Record<never, never>>;
/**
 * Get feed posts with smart algorithm
 * - Excludes user's own posts
 * - For new users (low engagement): Shows trending/popular content
 * - For established users (high engagement): Shows personalized content from followed users
 */
export declare const getFeedPosts: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    items: {
        id: string;
        postId: string;
        productId: string;
        modelId: string;
        leftLegFile: string | null;
        boneName: string;
        bodyPartType: string;
        scale: string;
        positionX: string;
        positionY: string;
        positionZ: string;
        productName: string;
    }[];
    textElements: {
        id: string;
        postId: string;
        content: string;
        positionX: string;
        positionY: string;
        fontSize: number;
        fontFamily: string;
        color: string;
        rotation: string;
        zIndex: number;
        createdAt: Date;
    }[];
    isLiked: boolean;
    isSaved: boolean;
    isFollowing: boolean;
    id: string;
    userId: string;
    caption: string | null;
    likesCount: number;
    sharesCount: number;
    savesCount: number;
    viewsCount: number;
    sceneMode: string;
    backgroundColor: string | null;
    createdAt: Date;
    userName: string | null;
    userImage: string | null;
    engagementScore: number;
}[], {
    items: {
        id: string;
        postId: string;
        productId: string;
        modelId: string;
        leftLegFile: string | null;
        boneName: string;
        bodyPartType: string;
        scale: string;
        positionX: string;
        positionY: string;
        positionZ: string;
        productName: string;
    }[];
    textElements: {
        id: string;
        postId: string;
        content: string;
        positionX: string;
        positionY: string;
        fontSize: number;
        fontFamily: string;
        color: string;
        rotation: string;
        zIndex: number;
        createdAt: Date;
    }[];
    isLiked: boolean;
    isSaved: boolean;
    isFollowing: boolean;
    id: string;
    userId: string;
    caption: string | null;
    likesCount: number;
    sharesCount: number;
    savesCount: number;
    viewsCount: number;
    sceneMode: string;
    backgroundColor: string | null;
    createdAt: Date;
    userName: string | null;
    userImage: string | null;
    engagementScore: number;
}[]>, Record<never, never>, Record<never, never>>;
/**
 * Get user's draft posts
 */
export declare const getDraftPosts: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    items: {
        id: string;
        postId: string;
        productId: string;
        modelId: string;
        leftLegFile: string | null;
        boneName: string;
        bodyPartType: string;
        scale: string;
        positionX: string;
        positionY: string;
        positionZ: string;
        createdAt: Date;
    }[];
    textElements: {
        id: string;
        postId: string;
        content: string;
        positionX: string;
        positionY: string;
        fontSize: number;
        fontFamily: string;
        color: string;
        rotation: string;
        zIndex: number;
        createdAt: Date;
    }[];
    id: string;
    userId: string;
    caption: string | null;
    likesCount: number;
    sharesCount: number;
    savesCount: number;
    viewsCount: number;
    isDraft: boolean;
    isPublished: boolean;
    sceneMode: string;
    backgroundColor: string | null;
    createdAt: Date;
    updatedAt: Date;
}[], {
    items: {
        id: string;
        postId: string;
        productId: string;
        modelId: string;
        leftLegFile: string | null;
        boneName: string;
        bodyPartType: string;
        scale: string;
        positionX: string;
        positionY: string;
        positionZ: string;
        createdAt: Date;
    }[];
    textElements: {
        id: string;
        postId: string;
        content: string;
        positionX: string;
        positionY: string;
        fontSize: number;
        fontFamily: string;
        color: string;
        rotation: string;
        zIndex: number;
        createdAt: Date;
    }[];
    id: string;
    userId: string;
    caption: string | null;
    likesCount: number;
    sharesCount: number;
    savesCount: number;
    viewsCount: number;
    isDraft: boolean;
    isPublished: boolean;
    sceneMode: string;
    backgroundColor: string | null;
    createdAt: Date;
    updatedAt: Date;
}[]>, Record<never, never>, Record<never, never>>;
/**
 * Get user's own posts (published and drafts)
 */
export declare const getMyPosts: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    items: {
        id: string;
        postId: string;
        productId: string;
        modelId: string;
        leftLegFile: string | null;
        boneName: string;
        bodyPartType: string;
        scale: string;
        positionX: string;
        positionY: string;
        positionZ: string;
        productName: string;
    }[];
    textElements: {
        id: string;
        postId: string;
        content: string;
        positionX: string;
        positionY: string;
        fontSize: number;
        fontFamily: string;
        color: string;
        rotation: string;
        zIndex: number;
        createdAt: Date;
    }[];
    isLiked: boolean;
    isSaved: boolean;
    isFollowing: boolean;
    id: string;
    userId: string;
    caption: string | null;
    likesCount: number;
    sharesCount: number;
    savesCount: number;
    viewsCount: number;
    sceneMode: string;
    backgroundColor: string | null;
    isDraft: boolean;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    userName: string | null;
    userImage: string | null;
}[], {
    items: {
        id: string;
        postId: string;
        productId: string;
        modelId: string;
        leftLegFile: string | null;
        boneName: string;
        bodyPartType: string;
        scale: string;
        positionX: string;
        positionY: string;
        positionZ: string;
        productName: string;
    }[];
    textElements: {
        id: string;
        postId: string;
        content: string;
        positionX: string;
        positionY: string;
        fontSize: number;
        fontFamily: string;
        color: string;
        rotation: string;
        zIndex: number;
        createdAt: Date;
    }[];
    isLiked: boolean;
    isSaved: boolean;
    isFollowing: boolean;
    id: string;
    userId: string;
    caption: string | null;
    likesCount: number;
    sharesCount: number;
    savesCount: number;
    viewsCount: number;
    sceneMode: string;
    backgroundColor: string | null;
    isDraft: boolean;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    userName: string | null;
    userImage: string | null;
}[]>, Record<never, never>, Record<never, never>>;
/**
 * Like a post
 */
export declare const likePost: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodString, import("@orpc/contract").Schema<{
    liked: boolean;
}, {
    liked: boolean;
}>, Record<never, never>, Record<never, never>>;
/**
 * Save a post
 */
export declare const savePost: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodString, import("@orpc/contract").Schema<{
    saved: boolean;
}, {
    saved: boolean;
}>, Record<never, never>, Record<never, never>>;
/**
 * Increment share count
 */
export declare const sharePost: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodString, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
/**
 * Increment view count
 */
export declare const viewPost: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodString, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
/**
 * Follow a user
 */
export declare const followUser: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodString, import("@orpc/contract").Schema<{
    following: boolean;
}, {
    following: boolean;
}>, Record<never, never>, Record<never, never>>;
/**
 * Get user's followers and following lists
 */
export declare const getFollowLists: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    followers: {
        id: string | null;
        name: string | null;
        image: string | null;
        email: string | null;
        followedAt: Date;
    }[];
    following: {
        id: string | null;
        name: string | null;
        image: string | null;
        email: string | null;
        followedAt: Date;
    }[];
    followersCount: number;
    followingCount: number;
}, {
    followers: {
        id: string | null;
        name: string | null;
        image: string | null;
        email: string | null;
        followedAt: Date;
    }[];
    following: {
        id: string | null;
        name: string | null;
        image: string | null;
        email: string | null;
        followedAt: Date;
    }[];
    followersCount: number;
    followingCount: number;
}>, Record<never, never>, Record<never, never>>;
/**
 * Get a single post by ID
 */
export declare const getPostById: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodString, import("@orpc/contract").Schema<{
    items: {
        id: string;
        postId: string;
        productId: string;
        modelId: string;
        leftLegFile: string | null;
        boneName: string;
        bodyPartType: string;
        scale: string;
        positionX: string;
        positionY: string;
        positionZ: string;
        productName: string;
    }[];
    textElements: {
        id: string;
        postId: string;
        content: string;
        positionX: string;
        positionY: string;
        fontSize: number;
        fontFamily: string;
        color: string;
        rotation: string;
        zIndex: number;
        createdAt: Date;
    }[];
    id: string;
    userId: string;
    caption: string | null;
    likesCount: number;
    sharesCount: number;
    savesCount: number;
    viewsCount: number;
    sceneMode: string;
    backgroundColor: string | null;
    isDraft: boolean;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    userName: string | null;
    userImage: string | null;
}, {
    items: {
        id: string;
        postId: string;
        productId: string;
        modelId: string;
        leftLegFile: string | null;
        boneName: string;
        bodyPartType: string;
        scale: string;
        positionX: string;
        positionY: string;
        positionZ: string;
        productName: string;
    }[];
    textElements: {
        id: string;
        postId: string;
        content: string;
        positionX: string;
        positionY: string;
        fontSize: number;
        fontFamily: string;
        color: string;
        rotation: string;
        zIndex: number;
        createdAt: Date;
    }[];
    id: string;
    userId: string;
    caption: string | null;
    likesCount: number;
    sharesCount: number;
    savesCount: number;
    viewsCount: number;
    sceneMode: string;
    backgroundColor: string | null;
    isDraft: boolean;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    userName: string | null;
    userImage: string | null;
}>, Record<never, never>, Record<never, never>>;
/**
 * Update an existing post
 */
export declare const updatePost: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodObject<{
    postId: z.ZodString;
    caption: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isDraft: z.ZodDefault<z.ZodBoolean>;
    sceneMode: z.ZodDefault<z.ZodEnum<{
        "3d": "3d";
        "2d": "2d";
    }>>;
    backgroundColor: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
        floor: "floor";
        studio: "studio";
        outdoor: "outdoor";
        minimal: "minimal";
    }>>>;
    items: z.ZodDefault<z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        modelId: z.ZodString;
        leftLegFile: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        boneName: z.ZodString;
        bodyPartType: z.ZodString;
        scale: z.ZodNumber;
        positionX: z.ZodNumber;
        positionY: z.ZodNumber;
        positionZ: z.ZodNumber;
    }, z.core.$strip>>>;
    textElements: z.ZodDefault<z.ZodArray<z.ZodObject<{
        content: z.ZodString;
        positionX: z.ZodNumber;
        positionY: z.ZodNumber;
        fontSize: z.ZodNumber;
        fontFamily: z.ZodString;
        color: z.ZodString;
        rotation: z.ZodNumber;
        zIndex: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    postId: string;
}, {
    success: boolean;
    postId: string;
}>, Record<never, never>, Record<never, never>>;
/**
 * Delete a post
 */
export declare const deletePost: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodString, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=fashion-posts.d.ts.map