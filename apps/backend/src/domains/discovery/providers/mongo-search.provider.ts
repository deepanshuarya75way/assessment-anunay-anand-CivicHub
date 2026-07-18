import { SearchProvider, SearchOptions } from './search.provider';
import { ISearchResult } from '@civichub/shared';
import { ProfileModel } from '../../identity/models/profile.model';
import { PostModel } from '../../community/posts/post.model';
import { CommunityModel } from '../../communities/models/community.model';
import { OrganizationModel } from '../../organizations/models/organization.model';
import { HashtagModel } from '../models/hashtag.model';
import { IssueModel } from '../../civic/models/issue.model';
import { DepartmentModel } from '../../civic/models/department.model';
import { CategoryModel } from '../../civic/models/category.model';
export class MongoSearchProvider implements SearchProvider {
  async search(options: SearchOptions): Promise<ISearchResult[]> {
    const { query, type = 'all', limit = 20, skip = 0 } = options;
    const regexQuery = new RegExp(query, 'i');
    
    // We can use MongoDB $text if indexes exist, but $regex is fine for MVP substring matching across fields.
    // For production with massive scale, $text or a dedicated search engine is better.
    
    const promises: Promise<ISearchResult[]>[] = [];

    // Search Users (Profiles)
    if (type === 'all' || type === 'user') {
      promises.push(
        ProfileModel.find({ $or: [{ username: regexQuery }, { bio: regexQuery }] })
          .limit(limit)
          .skip(skip)
          .then(profiles => profiles.map(p => ({
            type: 'user',
            id: (p.userId as any).toString(),
            title: p.username,
            subtitle: p.bio?.substring(0, 50),
            image: p.avatarUrl,
            url: `/users/${p.username}`
          })))
      );
    }

    // Search Communities
    if (type === 'all' || type === 'community') {
      promises.push(
        CommunityModel.find({ $or: [{ name: regexQuery }, { description: regexQuery }] })
          .limit(limit)
          .skip(skip)
          .then(comms => comms.map(c => ({
            type: 'community',
            id: c._id.toString(),
            title: c.name,
            subtitle: c.description?.substring(0, 50),
            image: c.avatarUrl,
            url: `/c/${c.slug}`
          })))
      );
    }

    // Search Organizations
    if (type === 'all' || type === 'organization') {
      promises.push(
        OrganizationModel.find({ $or: [{ name: regexQuery }, { description: regexQuery }] })
          .limit(limit)
          .skip(skip)
          .then(orgs => orgs.map(o => ({
            type: 'organization',
            id: o._id.toString(),
            title: o.name,
            subtitle: o.description?.substring(0, 50),
            image: o.avatarUrl,
            url: `/org/${o.slug}`
          })))
      );
    }

    // Search Posts
    if (type === 'all' || type === 'post') {
      promises.push(
        PostModel.find({ 'content.text': regexQuery })
          .limit(limit)
          .skip(skip)
          .then(posts => posts.map(p => ({
            type: 'post',
            id: p._id.toString(),
            title: p.content.text.substring(0, 60),
            subtitle: `By ${p.author.firstName} ${p.author.lastName}`,
            url: `/posts/${p._id.toString()}`
          })))
      );
    }

    // Search Hashtags
    if (type === 'all' || type === 'hashtag') {
      promises.push(
        HashtagModel.find({ tag: regexQuery })
          .limit(limit)
          .skip(skip)
          .then(tags => tags.map(t => ({
            type: 'hashtag',
            id: t._id.toString(),
            title: `#${t.tag}`,
            subtitle: `${t.usageCount} posts`,
            url: `/hashtags/${t.tag}`
          })))
      );
    }

    const resultsArray = await Promise.all(promises);

    // Search Civic Issues
    if (type === 'all' || type === 'issue') {
      promises.push(
        IssueModel.aggregate([
          { $match: { $or: [{ title: regexQuery }, { description: regexQuery }] } },
          { $lookup: { from: 'issuesupports', localField: '_id', foreignField: 'issueId', as: 'supports' } },
          { $lookup: { from: 'comments', localField: '_id', foreignField: 'targetId', as: 'comments' } },
          {
            $addFields: {
              score: {
                $add: [
                  { $multiply: [{ $size: '$supports' }, 5] }, // Supporters heavily weighted
                  { $multiply: [{ $size: '$comments' }, 3] }, // Discussions
                  { $multiply: [{ $size: { $ifNull: ['$citizenUpdates', []] } }, 2] }, // Recent updates
                  { $size: { $ifNull: ['$workflowHistory', []] } } // Workflow activity
                ]
              }
            }
          },
          { $sort: { score: -1 } },
          { $skip: skip },
          { $limit: limit }
        ]).then(issues => issues.map(i => ({
            type: 'issue' as const,
            id: i._id.toString(),
            title: i.title,
            subtitle: i.currentStatus,
            url: `/issues/${i._id.toString()}`
          })))
      );
    }

    // Search Departments
    if (type === 'all' || type === 'department') {
      promises.push(
        DepartmentModel.find({ $or: [{ name: regexQuery }, { description: regexQuery }] })
          .limit(limit)
          .skip(skip)
          .then(depts => depts.map(d => ({
            type: 'department' as const,
            id: d._id.toString(),
            title: d.name,
            subtitle: 'Department',
            url: `/departments/${d._id.toString()}`
          })))
      );
    }

    // Search Categories
    if (type === 'all' || type === 'category') {
      promises.push(
        CategoryModel.find({ name: regexQuery })
          .limit(limit)
          .skip(skip)
          .then(cats => cats.map(c => ({
            type: 'category' as const,
            id: c._id.toString(),
            title: c.name,
            subtitle: 'Category',
            url: `/categories/${c._id.toString()}`
          })))
      );
    }

    const finalResultsArray = await Promise.all(promises);
    const combinedResults = finalResultsArray.flat();
    
    // Simple relevance: sort by title length (closer exact match generally means shorter) or some custom logic
    // For now, returning as is
    return combinedResults.slice(0, limit);
  }
}
