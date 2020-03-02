import React from 'react';
import { Link, graphql, StaticQuery } from 'gatsby'
import truncate from 'truncate-html'
import './PostListing.css'

export default (props) => (
	<StaticQuery
		query={graphql`
        query PostListingModuleQuery {
            allAgilityPost(
              filter: {
                properties: { referenceName: { eq: "posts"}}
              },
              limit: 10
            ) {
                totalCount
                nodes {
                    contentID
                    customFields {
                        title
                        details
                        image {
                            url
                        }
                    }
                    sitemapNode {
                        pagePath
                    }
                    properties {
                        referenceName
                    }
                }
            }
          }
        `}
		render={queryData => {
			return (
				<PostsListing posts={queryData.allAgilityPost.nodes} {...props} />
			);
		}}
	/>
)

const PostsListing = ({ item, posts }) => {
    return (
        <section className="posts-listing" >
            <div className="container">
                <h1>{item.customFields.title}</h1>
                <div className="posts-listing-container">
                    <Posts posts={posts} />
                </div>
            </div>
        </section>
    )
}

const Posts = ({ posts }) => {
    return posts.map(post => {
        return <Post key={post.contentID} post={post} />;
    })
}

const Post = ({ post }) => {
    return(
        <div className="post" key={post.contentID}>
            <Link to={post.sitemapNode.pagePath}>
                <PostImage image={post.customFields.image} />
                <h2>{post.customFields.title}</h2>
                <PostExceprt htmlContent={post.customFields.details} />
            </Link>
        </div>
    )
}

const PostImage = ({ image }) => {
    let imageToRender = null;
    if(image && image.url) {
        imageToRender = <img src={image.url + '?w=480'} alt={image.label} />
    }
    return imageToRender;
}

const PostExceprt = ({ htmlContent }) => {
    const renderHTML = () => {
        const excerpt = truncate(htmlContent, { stripTags: true, length: 160 });
		return { __html: excerpt };
    }
    return(<p dangerouslySetInnerHTML={renderHTML()}></p>)
}
