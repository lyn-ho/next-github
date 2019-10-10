import LRU from 'lru-cache'

const REPO_CACHE = new LRU({
  maxAge: 1000 * 60 * 60,
})

export function cache(repo) {
  REPO_CACHE.set(repo.full_name, repo)
}

// {owner}/{name}
export function get(full_name) {
  return REPO_CACHE.get(full_name)
}

export function cacheArray(repos) {
  if (repos && Array.isArray(repos)) {
    repos.forEach((repo) => cache(repo))
  }
}
