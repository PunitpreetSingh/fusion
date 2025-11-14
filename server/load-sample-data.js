import { supabase } from './db.js';

const PLACEHOLDER_IMAGE_URL = 'https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg';

const cleanHtmlContent = (html) => {
  if (!html) return html;
  const imageRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  return html.replace(imageRegex, (match, url) => {
    return match.replace(url, PLACEHOLDER_IMAGE_URL);
  });
};

const sampleSpace = {
  "id": "2867",
  "placeID": "449039",
  "name": "Mitsubishi Fuso Truck and Bus Corporation",
  "displayName": "daimler-trucks-asia-japan",
  "description": "Based in Kawasaki, Japan, Mitsubishi Fuso Truck and Bus Corporation (MFTBC) is one of Asia's leading commercial vehicle manufacturers. An icon of the Japanese commercial vehicle industry with more than 80 years of its history, MFTBC manufactures a range of commercial vehicles which has redefined intercity and intra-city logistics movement around the world.",
  "tags": ["fuso", "mftbc", "japan", "mitsubishi fuso", "kawasaki", "dta japan"],
  "published": "2018-03-06T01:22:16.255+0000"
};

const userMapping = {
  "RAKPURI": {
    "backingStore": {
      "store": {
        "id": { "value1": "955a0125-d667-4119-b048-7a9c78b5213b" },
        "displayName": { "value1": "Puri, Rakesh (365)" },
        "mail": { "value1": "rakesh.puri@daimlertruck.com" },
        "userPrincipalName": { "value1": "RAKPURI@tbdir.net" }
      }
    }
  }
};

const samplePost = {
  "id": "175040",
  "subject": "2023 FUSO Family Day",
  "content": {
    "text": `<body><!-- [DocumentBodyStart:963e0a0f-7c01-4a53-a19b-19b1e5d0d9a1] --><div class="jive-rendered-content"><div class="teaser"><a href="https://uat.social.cloud.tbintra.net/servlet/JiveServlet/showImage/38-175040-2325906/Main.JPG"><img data-image-id="2325906" data-source="own" data-teaserid="2325906" data-teasertext="" height="633" src="https://uat.social.cloud.tbintra.net/servlet/JiveServlet/downloadImage/38-175040-2325906/Main.JPG" style=";" width="1600"/></a><div class="web-text"><p>Family Day was held at the Kawasaki Plant on Sunday, November 26.</p></div></div><div class="teaser2"><a href="https://uat.social.cloud.tbintra.net/servlet/JiveServlet/showImage/38-175040-2325904/Main.JPG"><img data-image-id="2325904" data-teaserid="2325904" height="890" src="https://uat.social.cloud.tbintra.net/servlet/JiveServlet/downloadImage/38-175040-2325904/Main.JPG" style=";" width="1600"/></a></div><div class="p-content layoutBlock clearfix" data-tpl="text"><div class="column p-text p-one"><span column="column" export-text=""></span><div class="rte-text-wrapper"><p>This year marked the 12th Family Day at the Kawasaki Plant, which began in 2010. The Family Day was temporarily suspended in recent years due to Corona, but was revived on a limited scale last year and resumed in full scale this year.</p><p>&#160;</p><p>Despite the inclement weather, approximately 2,600 people from the neighborhood, employees, and their families attended the event.<br type="_moz"/></p></div></div></div></div><!-- [DocumentBodyEnd:963e0a0f-7c01-4a53-a19b-19b1e5d0d9a1] --></body>`
  },
  "published": "2023-11-29T02:24:45.132+0000",
  "updated": "2023-11-29T02:24:45.132+0000",
  "author": {
    "id": "2325",
    "displayName": "Momoko Fujita",
    "jive": {
      "enabled": true,
      "username": "MOMFUJI",
      "visible": true
    }
  },
  "tags": [],
  "likeCount": 7,
  "viewCount": 125,
  "parentPlace": {
    "id": "3892"
  }
};

const sampleComment = {
  "id": "655328",
  "subject": "2023 FUSO Family Day",
  "content": {
    "text": '<body><!-- [DocumentBodyStart:e030e156-9e64-4f9a-99c3-63a86661a8b0] --><div class="jive-rendered-content"><p>Amazing pics. Family is not an important thing. Its everything<img class="emoticon_happy emoticon-inline" height="16px" src="https://uat.social.cloud.tbintra.net/images/emoticons/happy.png" width="16px"/></p></div><!-- [DocumentBodyEnd:e030e156-9e64-4f9a-99c3-63a86661a8b0] --></body>'
  },
  "published": "2023-11-29T03:33:15.319+0000",
  "updated": "2023-11-29T03:33:15.319+0000",
  "author": {
    "id": "623273",
    "displayName": "Karthick Shankar",
    "jive": {
      "enabled": true,
      "username": "KASHANK",
      "visible": true
    }
  },
  "parent": "https://uat.social.cloud.tbintra.net/api/core/v3/contents/2675667"
};

async function loadSampleData() {
  console.log('Starting to load sample data...');

  try {
    const users = [
      {
        id: samplePost.author.id,
        username: samplePost.author.jive.username,
        display_name: samplePost.author.displayName,
        email: null,
        enabled: true
      },
      {
        id: sampleComment.author.id,
        username: sampleComment.author.jive.username,
        display_name: sampleComment.author.displayName,
        email: null,
        enabled: true
      },
      {
        id: '955a0125-d667-4119-b048-7a9c78b5213b',
        username: 'RAKPURI',
        display_name: 'Puri, Rakesh (365)',
        email: 'rakesh.puri@daimlertruck.com',
        enabled: true
      }
    ];

    console.log('Inserting users...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .upsert(users, { onConflict: 'id' })
      .select();

    if (usersError) {
      console.error('Error inserting users:', usersError);
      throw usersError;
    }
    console.log(`Inserted ${usersData.length} users`);

    const space = {
      id: sampleSpace.id,
      name: sampleSpace.name,
      display_name: sampleSpace.displayName,
      description: sampleSpace.description,
      tags: sampleSpace.tags,
      created_by: users[2].id,
      published: sampleSpace.published
    };

    console.log('Inserting space...');
    const { data: spaceData, error: spaceError } = await supabase
      .from('spaces')
      .upsert([space], { onConflict: 'id' })
      .select();

    if (spaceError) {
      console.error('Error inserting space:', spaceError);
      throw spaceError;
    }
    console.log(`Inserted space: ${spaceData[0].name}`);

    const cleanedPostContent = cleanHtmlContent(samplePost.content.text);
    const post = {
      id: samplePost.id,
      subject: samplePost.subject,
      content: cleanedPostContent,
      author_id: samplePost.author.id,
      space_id: sampleSpace.id,
      tags: samplePost.tags,
      like_count: samplePost.likeCount,
      view_count: samplePost.viewCount,
      published: samplePost.published,
      updated: samplePost.updated
    };

    console.log('Inserting post...');
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .upsert([post], { onConflict: 'id' })
      .select();

    if (postError) {
      console.error('Error inserting post:', postError);
      throw postError;
    }
    console.log(`Inserted post: ${postData[0].subject}`);

    const cleanedCommentContent = cleanHtmlContent(sampleComment.content.text);
    const comment = {
      id: sampleComment.id,
      post_id: samplePost.id,
      content: cleanedCommentContent,
      commented_by: sampleComment.author.id,
      published: sampleComment.published,
      updated: sampleComment.updated
    };

    console.log('Inserting comment...');
    const { data: commentData, error: commentError } = await supabase
      .from('comments')
      .upsert([comment], { onConflict: 'id' })
      .select();

    if (commentError) {
      console.error('Error inserting comment:', commentError);
      throw commentError;
    }
    console.log(`Inserted ${commentData.length} comment`);

    console.log('\n✅ Sample data loaded successfully!');
    console.log('\nSummary:');
    console.log(`- Users: ${usersData.length}`);
    console.log(`- Spaces: 1`);
    console.log(`- Posts: 1`);
    console.log(`- Comments: 1`);

  } catch (error) {
    console.error('❌ Error loading sample data:', error);
    process.exit(1);
  }

  process.exit(0);
}

loadSampleData();
